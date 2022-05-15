const http = require("http");
const fs = require('fs');
const server = http.createServer((req,res)=>{
    console.log("request has been made from browser to server");
    // console.log(req.method);
    // console.log(req.url);
    let path = './views';
    switch(req.url){
        case '/':
            res.statusCode=200;
            path+='/index.html';
            break;

        case '/about':
            res.statusCode=200;
            path+='/about.html';
            break;
        case '/about-me':
            res.statusCode=301;
            res.setHeader('Location','/about');
            res.end();
        default:
            path+='/404.html'
            break;
    }
    res.setHeader('Content-Type','text/html');
    // res.write("<h1>Hello!! Learning backend again</h1>");
    fs.readFile(path,(err,fileData)=>{
        if(err){
            console.log(err.message);
        }else{
            res.write(fileData);
            res.end();
        }
    });
});

server.listen(3000,'localhost',()=>{
    console.log("server is listening on port 3000");
});


