const userModel = require('../model/userModel');
const cookieParser = require('cookie-parser');

module.exports.getUser = async function getUser(req, res) {
    let id = req.id;
    let user = await userModel.findById(id);
    if (user) {
      return res.json(user);
    } else {
      return res.json({
        message: "user not found",
      });
    }
  }

module.exports.postUser=async function postUser(req,res){
    console.log(req.body);
    let dataObj = req.body;
    let user = await userModel.create(dataObj);
    res.json({
        message:"Data received",
        data:user
    })
}

module.exports.updateUser = async function updateUser(req, res) {
    console.log("req.body-> ", req.body);
    //update data in users obj
    try {
      let id = req.params.id;
      console.log(id);
      let user = await userModel.findById(id);
      console.log(user);
      let dataToBeUpdated = req.body;
      if (user) {
        console.log('inside user');
        const keys = [];
        for (let key in dataToBeUpdated) {
          console.log(key);
          keys.push(key);
        }
  
        for (let i = 0; i < keys.length; i++) {
          console.log(keys[i]);
          user[keys[i]] = dataToBeUpdated[keys[i]];
        }
        console.log(user);
        user.confirmPassword=user.password;
        const updatedData = await user.save();
        console.log(updatedData);
        res.json({
          message: "data updated successfully",
          data: updatedData,
        });
      } else {
        res.json({
          message: "user not found",
        });
      }
    } catch (err) {
      res.json({
        message: err.message,
      });
    }
};

module.exports.deleteUser=async function deleteUser(req,res){
    try{
        let id = req.params.id;
        let user = await userModel.findByIdAndDelete(id);
        if(!user){
            return res.json({
                message:"User Not Found"
            })
        }
        return res.json({
            message:"User has been deleted",
            data:user
        })
    }
    catch(err){
        res.json({
            message:err.message
        })
    }
}

//admin specific function
module.exports.getAllUsers=async function getAllUsers(req,res){
    try{
        let user = await userModel.find();
        if(user){
            res.json({
                message:"Users Retrieved",
                data:user
            }) 
        }
        else{
            res.json({
            message:"Users Not Found"
        })
        }   
    }
    catch(err){
        res.json({
            message:err.message
        })
    }
}

module.exports.updateProfileImage=function updateProfileImage(req,res){
  res.json({
    message:'file uploaded successfully'
  });
}




