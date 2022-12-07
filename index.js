// server creation

// 1 import express 

const express = require('express');

//import JWT from 'express-jwt';

const jwt=require('jsonwebtoken');

// Import dataService

const dataService = require('./service/dataService');

//import cors

const cors = require('cors');


// 2- create an app using express

const app = express();

//give command to share data via cors

app.use(cors({
    origin:['http://localhost:4200','http://192.168.1.36:8080']
}))

// to parse json from req body

app.use(express.json());

// 3- create a port number

app.listen(3000, ()=>{
    console.log("listening on port 3000")
})

// application specific middleware

const middleware = (req,res,next)=>{
    console.log('application specific middleware');
    next();
}
app.use(middleware);

//router specific middleware

const jwtMiddleWare = (req,res,next)=>{
    try{
    const token=req.headers['x-access-token'];
    const data=jwt.verify(token,'arsenal123')
    next();
}
catch(error){
// 422 Unprocessable error
res.status(422).json({
    statusCode:422,
    status:false,
    message:'please login'
})
}
}


//4- resolving HTTP requests

app.get('/', (req, res) => {
    res.send("GET METHOD");
})

// 5- post method

app.post('/', (req, res) => {
    res.send("Post Method");

})

// 6- put method


app.put('/', (req, res) => {

    res.send("PUT METHOD");
    
})

// 7- delete method

app.delete('/', (req, res) => {

    res.send("delete method")
})

// 8- patch method


app.patch('/', (req, res) => {

    res.send('patch method');

})

// API calls or request

// login
// register
// deposit
// withdraw
// transaction

// Resolving Register Request

app.post('/register', (req, res) => {
    console.log(req.body);
dataService.register(req.body.acno,req.body.username, req.body.password)
.then(result=>{
    res.status(result.statusCode).json(result);

})
    // if(result){
    //     res.send("Registered Successfully ");

    // }
    // else{
    //     res.send("User Already Exist")
    // }

})

// resolving login request

app.post('/login', (req, res) => {
    console.log("login",req.body);
    dataService.login( req.body.acno, req.body.password)
    .then(result=>{
    res.status(result.statusCode).json(result)
    })
});

// resolving login request

app.post('/deposit',jwtMiddleWare, (req, res) => {
    console.log(req.body);
    dataService.deposit( req.body.acno, req.body.password, req.body.amount)
    .then(result => {
        res.status(result.statusCode).json(result);
    })
});

// resolving login request

app.post('/withdraw',jwtMiddleWare, (req, res) => {
    
    dataService.withdraw( req.body.acno, req.body.password, req.body.amount)
    .then(result=>{
    res.status(result.statusCode).json(result)
    })
    })

// resolving login request

app.post('/transaction',jwtMiddleWare,(req,res)=>{
    console.log(req,body);
    dataService.getTransaction( req.body.acno)
    .then(result=>{
        res.status(result.statusCode).json(result);
    })
})

app.delete('/deleteacc/:acno',(req,res)=>{
    dataService.deleteacc(req.params.acno)
    .then(result=>{
        res.status(result.statusCode).json(result);
    })
});
