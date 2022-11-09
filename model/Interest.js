const mongoose= require('mongoose');

const interest= new mongoose.Schema({
    user:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Researchinfo'
     }],
     tittle:{
         type:String,
         unique:true

     }


})


const Interest= mongoose.model('Interest',interest);
module.exports=Interest;