// dataBase Integration


//1 server and mongoDB integration

// mongoose import 

const{ default: mongoose } = require('mongoose');
// const mongoose = require('mongoose'); 



//2 state connection string via mongoDB integrstion

mongoose.connect('mongodb://localhost:27017',
{
    useNewUrlParser: true,
    //to avoid warning
});

//3 define bank db model

const user=mongoose.model('user',
{
    //schema
    acno:Number,
    username:String,
    password:Number,
    balance:0,
    transaction:[]
})
module.exports={
    user
}