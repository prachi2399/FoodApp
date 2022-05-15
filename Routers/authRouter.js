const express = require('express');
const userModel = require('../model/userModel');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const JWT_KEY = require('../secrets');

const authRouter = express.Router();

authRouter
.route('/signup')
.get(middleware1, getSignUp,middleware2)
.post(postSignUp);

authRouter
.route('/login')
.post(loginUser);

function getSignUp(req,res,next){
    console.log("Get Signup called");
    // res.sendFile('public/index.html',{root:__dirname});
    next();
}

async function postSignUp(req,res){
    console.log(req.body);
    let dataObj = req.body;
    let user = await userModel.create(dataObj);
    res.json({
        message:"Data received",
        data:user
    })
}

function middleware1(req,res,next){
    console.log("middleWare encountered");
    next();
}

function middleware2(req,res,next){
    console.log("middleware 2 ended req/res cycle");
    res.sendFile('public/index.html',{root:__dirname});
}

async function loginUser(req,res){
    try{
        let data = req.body;
        if(data.email){
            let user = await userModel.findOne({email:data.email});
            if(user){
                //bcrypt compare function for hashed passsword
                if(user.password==data.password){
                    let uid = user['_id'];
                    let token = jwt.sign({payload:uid},JWT_KEY);
                    res.cookie('login',token,{httpOnly:true});
                    return res.json({
                        message:"User Logged-in Successfully",
                        userDetails:data
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
module.exports=authRouter;