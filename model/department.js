const mongoose= require('mongoose');

const department= new mongoose.Schema({
    department:[{
        type:String,
        unique:true
     }],
     paper:{
         type:Number,
         

     }


})


const Department= mongoose.model('Department',department);
module.exports=Department;