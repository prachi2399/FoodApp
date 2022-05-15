const express = require('express');
const app = express();
app.listen(3000);
app.use(express.json());

const userRouter = express.Router();
const authRouter = express.Router();

app.use("/user",userRouter);
app.use("/auth",authRouter);

authRouter
.route('/signup')
.get(middleware1, getSignUp,middleware2)
.post(postSignUp);

function middleware1(req,res,next){
    console.log("middleWare encountered");
    next();
}

function middleware2(req,res,next){
    console.log("middleware 2 ended req/res cycle");
    res.sendFile('public/index.html',{root:__dirname});
}

userRouter
.route('/')
.get(getUser)
.post(postUser)
.patch(updateUser)
.delete(deleteUser);

userRouter
.route('/:id')
.get(getUserById);

app.get('/users/:id',(req,res)=>{
    console.log(req.params.id);
    res.json({
        message:"data recieved Successfully"
    })
})

function getUser(req,res){
    console.log(req.query);
    res.send(users);
}

function postUser(req,res){
    console.log(req.body);
    users= req.body;
    res.json({
        message:"Data received",
        user:req.body
    })
}

function updateUser(req,res){
    console.log(req.body);
    let dataToBeUpdated = req.body;
    for(key in dataToBeUpdated){
        users[key]=dataToBeUpdated[key]
    }
    res.json({
        message:"Data updated Successfully"
    })
}

function deleteUser(req,res){
    users= {};
    res.json({
        message:"Data Deleted"
    })
}

function getUserById(req,res){
    console.log(req.params.id);
    let param = req.params.id;
    let obj={};
    for(let i=0;i<users.length;i++){
        if(users[i]['id']==param){
            obj = users[i]
        }
    }
    res.json({
        message:"data recieved Successfully",
        data:obj
    })
}

function getSignUp(req,res,next){
    console.log("Get Signup called");
    // res.sendFile('public/index.html',{root:__dirname});
    next();
}

function postSignUp(req,res){
    let obj = req.body;
    console.log("backend",obj);
    
    res.json({
        message:"user Signed-up",
        data:obj
    })
}