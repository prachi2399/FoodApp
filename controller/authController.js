const express = require('express');
const userModel = require('../model/userModel');
const { sendMail } = require("../utility/nodemailer");
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const JWT_KEY = require('../secrets');

// signup user
module.exports.signUp = async function signUp(req,res){
    try{
        let data = req.body;
        let user = await userModel.create(data);
        sendMail("signup",user);
        if(user){
            return res.json({
                message:"User Signed-up",
                data:user
            })
        }else return res.json({
            message:"Error while Signup"
        })
    }
    catch(err){
        return res.json({
            message:err.message
        })
    }

}

//login user
module.exports.login = async function login(req,res){
    try{
        let data = req.body;
        // console.log(typeof data);
        if(data.email){
            let user = await userModel.findOne({email:data.email});
            if(user){
                //bcrypt compare function for hashed password
                if(user.password==data.password){
                    let uid = user['_id'];
                    let token = jwt.sign({payload:uid},JWT_KEY);
                    res.cookie('login',token,{httpOnly:true});
                    let obj = data;
                    // obj["_id"]=uid;
                    console.log(uid);
                    return res.json({
                        message:"User Logged-in Successfully",
                        userDetails:user
                    })
                }else{
                    return res.json({
                        message:"Wrong Credentials"
                    });
                }
            }
            else{
                return res.json({
                    message:"user not found"
                });
            }
        }else{
            return res.json({
                message:"Empty Field"
            });
        }
    }catch(err){
        return res.json({
            message:err.message
        });
    }
}

//isAuthorized
module.exports.isAuthorized=function isAuthorized(role){
    return function(req,res,next){
        if(role.includes(req.role)==true){
            next();
        }else{
            res.status(401).json({
                message:"Operation not allowed"
            })
        }
    }
}

//protectRoute
module.exports.protectRoute = async function protectRoute(req, res, next) {
    try {
      let token;
      if (req.cookies.login) {
        console.log(req.cookies);
        token = req.cookies.login;
        let payload = jwt.verify(token, JWT_KEY);
        if (payload) {
          console.log("payload token", payload);
          const user = await userModel.findById(payload.payload);
          req.role = user.role;
          req.id = user.id;
          console.log(req.role, req.id);
          next();
        } else {
          return res.json({
            message: "please login again",
          });
        }
      } else {
            const client = res.get('User-Agent');
            // if(client.includes("Mozilla")==true){
            //     return res.redirect("/login");
            // }
            //postman
            res.json({
                message: "please login",
            });
      }
    } catch (err) {
      return res.json({
        message: err.message,
      });
    }
  };


//forgetPassword
module.exports.forgetpassword = async function forgetpassword(req,res){
    try{
        let {email} = req.email;
        let user = await userModel.findOne({email:email});
        if(user){
            //createResetToken is used to create a new token
            const resetToken= user.createResetToken();
            //https://abc/resetpassword/resettoken
            let resetPasswordLink = `${req.protocol}://
            ${req.get('host')}/resetpassword/${resetToken}`

            //send email to the user
            //nodemailer
            let obj={
              resetPasswordLink:resetPasswordLink,
              email:email
            }
            sendMail("resetPassword",obj);
            return res.json({
              message: "reset password link sent",
              data:resetPasswordLink
            })
        }else{
            res.json({
                message:"Register First"
            })
        }
    }
    catch(err){
        res.status(500).json({
            message:err.message
        })
    }
}

//resetpassword
module.exports.resetpassword = async function resetpassword(req,res){
    try{
        const token = req.params.token;
        let {password,confirmPassword}=req.body;

        let user = await userModel.findOne({resetToken:token});
        if(user){
            //resetPasswordHandler will update user's password in db
            user.resetPasswordHandler(password, confirmPassword);

            await user.save();
            res.json({
                message: "password changed successfully, please login again"
            });
        }else{
            res.json({
                message: "user not found"
            });
        }
    }catch(err){
        res.json({
            message:err.message
        })
    }
}

//logout
module.exports.logout=function logout(req,res){
    res.cookie('login',' ',{maxAge:1});
    res.json({
      message:"user logged out succesfully"
    });
}