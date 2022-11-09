const mongoose= require('mongoose');

const researchpaper= new mongoose.Schema({
    tittle:{
        type:String,
        
     },
     link:{
        type:String,
        
     },
     author:{
         type:Array
         
     },
     publication:{
        type:String,
     },
     publishyear:{
        type:Number,
        
     },
     cited:{
      type:Number,
      
     },
     issn:{
        type:String, 
     },
     user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Researchinfo'
     }
     


})


const Researchpapers= mongoose.model('Researchpapers',researchpaper);
module.exports=Researchpapers;