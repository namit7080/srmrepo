const mongoose= require('mongoose');
const bycrypt= require('bcryptjs');

const sing= new mongoose.Schema({
   first:{
       type:String,
       required:true,
   },
   lastname:{
      type:String,
      required:true,
   },
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
   password:{
       type:String,
       required:true,
   },
   info:{
    type:mongoose.Schema.Types.ObjectId,
    ref:'Researchinfo'
   },




});

// Hashing the password

sing.pre('save', async function(next){
    console.log("Inside");
    if(this.isModified('password')){
       
       var password=this.password;
       await bycrypt.hash(password, 6).then(function(hash) {
 
          console.log(hash);
          password=hash;
      });
    
      this.password=password;
    }
    next();
 })


const Singup= mongoose.model('Singup',sing);
module.exports=Singup;