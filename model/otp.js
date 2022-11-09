const mongoose= require('mongoose');

const otp= new mongoose.Schema({
   email:{
       type:String
   },
   code:{
       type:String,
       index:{expires:'1m'}
   }




});
otp.index({"code":1},{expireAfterSeconds:20});


const OTP= mongoose.model('OTP',otp);
module.exports=OTP;