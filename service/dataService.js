// import JWT 
const jwt=require('jsonwebtoken');
const { SchemaTypeOptions } = require('mongoose');

// import db.js

const db = require('./db.js');



userDetails= {//object of objects
    1000: { acno: 1000, username: 'Rihan', password: 1000, balance: 1000,transaction:[] },
    1001: { acno: 1000, username: 'Amal', password: 1001, balance: 1000,transaction:[]  },
    1002: { acno: 1000, username: 'Sarath', password: 1002, balance: 1000 ,transaction:[] }
  }

  const register=(acno, username, password)=> {

    return db.user.findOne({acno})//port 27017 , backendport 3000

    .then((user)=>{
      if(user){
        return{
          statusCode:401,
          status:false,
          message:"user already exists"

        }
      }
      else{
        const newUser=new db.user({
          acno,
          username,
          password,
          balance:0,
          transaction:[]
        }
        )
        newUser.save() //to store data in mongodb 
   
      return {
        statusCode:200,
        status: true,
        message: 'Registered succesfully'

       }
      }

    })

    if (acno in userDetails) {
      return {
        statusCode:401,
        status : false,
        message: 'Username already exists'

      }
    }
    else {
      userDetails[acno] = {
        acno,
        username,
        password,
        balance: 0,
        transaction:[] 
      }
      console.log(userDetails);
      
     
    }
  }
  const login=(acno, password)=> {
  
    return db.user.findOne({acno,password:password})//port 27017 , backendport 3000
    .then((user)=>{
      console.log("here");
      if(user){
      currentUser=user.username
      currentAcno=acno;
      //token generation

      const token = jwt.sign({currentAcno:acno},'arsenal123')
      return{
        statusCode:200,
        status:true,
        message:'login Successfully',
        currentAcno,
        currentUser,
        token
      }
      
    }else{
      return{
        statusCode:401,
        status:false,
        message:'Incorrect Password/Username'
    }
    
  }

})  
    
  
  
    if (acno in userDetails) {
      if (password == userDetails[acno].password) {
        currentUser = userDetails[acno]['username']
        currentAcno=acno;

        const token = jwt.sign({currentAcno:acno},'arsenal123')
        return{
          statusCode:200,
          status:true,
          message:'login Success',
          currentAcno,
          currentUser,
          token
        }
        
      }
      else 
        return{
        statusCode:401,
        status:false,
        message:'Password Incorrect'
      }

    }
    else return{
      statusCode:401,
      status:false,
      message:'Invalid User'
    }
  }

  
  
  const deposit = (acno,pswd,amt) =>
  {
    var amount=parseInt(amt);
    return db.user.findOne({acno,password:pswd})
    .then(user=>{
      if(user){
        user.balance+=parseInt(amount);
        user.transaction.push({
          type:'credit',
          amount
        })
        user.save()

        return {
          statusCode:200,
          status:true,
          message: `${amount} is credited succesfully. Balance is ${user.balance}`
        }
      }
      else{
        return {
          statusCode:401,
          status : false,
          message : "password or username invalid"
        }
      }
    })
}
const withdraw=(acno, password, amount)=> {
  var amount =parseInt(amount)
  return db.user.findOne({acno,password})
  .then(user=>{
    if(user){
      if(user.balance>amount){
        user.balance = amount.balance-amount
      user.transaction.push({
        type:'Debit',
        amount
      })
      user.save()
    // console.log(userDetails);
      return {
        statusCode:200,
        status:true,
        message:`${amount} is debited, balance is ${user.balance}`
      }     
     }
  
    else{
      return{
        statusCode:401,
        status:false,
        message:"insufficent balance"
      }
          }
        }

  
        })
      }

  // Get Transaction 
  const getTransaction=(acno)=>{
    return db.user.findOne ({acno})
      .then(user=>{
        if(user){
          return{
            statusCode:200,
            status:true,
            message:user.transaction
          }
        }
        else{
          return{
            statusCode:400,
            status:false,
            message: 'transfer error'
        }
      }
      })
      // statusCode:200,
      // status:true,
      // transaction:userDetails[acno]['transaction']

    // this.userDetails[acno]['transaction']
  }

  //deleteaccount
  const deleteacc=(acno)=>{
    return db.user.findOne({acno})
     .then(user=>{
        if(user){
          return{
            statusCode:200,
            status:true,
            message:"account deleted"
          }
        }else{
          return{
            statusCode:400,
            status:false,
            message:"account not found"
          }
        }
      })
    }
    


  module.exports={
    register,
    login,
    deposit,
    withdraw,
    getTransaction,
    deleteacc
  }