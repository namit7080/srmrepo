const mongoose= require('mongoose');

const research= new mongoose.Schema({
    name:{
        type:String,
        
     },
     department:{
      type:String,
      required:true,
     },
     affliation:{
        type:String,
        
     },
     profilepic:{
         type:String,
         
     },
     interest:[{
        type:String,
        
     }],
     papers:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Researchpapers'
     }],
     table:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Table'
     },
     coauthor:[{
         type:Object
     }],
     singup:{
      type:mongoose.Schema.Types.ObjectId,
      ref:'Singup'
     },
     post:{
        type:String
     }


},{
    timestamps:true
})


const Researchinfo= mongoose.model('Researchinfo',research);
module.exports=Researchinfo;