const mongoose= require('mongoose');
const bycrypt= require('bcryptjs');

const sing= new mongoose.Schema({
  
   department:{
    type:String,
    required:true,
   },
   scholarurl:{
       type:String,
       required:true,
   },
   email:{
       type:String,
       unique:true,
       required:true,
   },
  
   info:{
    type:mongoose.Schema.Types.ObjectId,
    ref:'Researchinfo'
   },




});

// Hashing the password




const Singup= mongoose.model('Singup',sing);
module.exports=Singup;