const express = require('express');
const userModel = require('../model/userModel');
const cookieParser = require('cookie-parser');
const multer=require('multer');
const{getUser,updateUser,deleteUser,getAllUsers,updateProfileImage} = require('../controller/userController');
const{signUp,login,protectRoute,isAuthorized,forgetpassword,resetpassword,logout} = require('../controller/authController');
const userRouter = express.Router();

//user options
userRouter.route('/:id')
.patch(updateUser)
.delete(deleteUser);

userRouter
.route('/signup')
.post(signUp)

userRouter
.route('/login')
.post(login)


//multer for fileupload

// upload-> storage , filter
const multerStorage=multer.diskStorage({
    destination:function(req,file,cb){
        cb(null,'public/images')
    },
    filename:function(req,file,cb){
        cb(null,`user-${Date.now()}.jpeg`)
    }
});

//multer for file upload
const filter = function (req, file, cb) {
    if (file.mimetype.startsWith("image")) {
      cb(null, true)
    } else {
      cb(new Error("Not an Image! Please upload an image"), false)
    }
  }

const upload = multer({
    storage: multerStorage,
    fileFilter: filter
  });

  userRouter.post("/ProfileImage", upload.single('photo') ,updateProfileImage);
  //get request
  userRouter.get('/ProfileImage',(req,res)=>{
      res.sendFile("/Users/prachi/Desktop/App/multer.html");
  });


//profile page 
userRouter.use(protectRoute);
userRouter
.route('/userProfile')
.get(getUser)

//resetPassword
userRouter
.route('/resetpassword/:token')
.post(resetpassword)

userRouter
.route('/logout')
.get(logout)


//forgetPassword
userRouter
.route('/forgetpassword')
.post(forgetpassword)

//admin specific
userRouter.use(isAuthorized(['admin']))
userRouter
.route('')
.get(getAllUsers)

 
module.exports = userRouter


