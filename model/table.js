const mongoose= require('mongoose');

const table= new mongoose.Schema({
    citations:{
        type:Number
     },
     h_index:{
         type:Number
     },
     i10_index:{
        type:Number
     },
     graph:[{
         type:Object
     }],
     author:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Researchinfo'
     }


})


const Table= mongoose.model('Table',table);
module.exports=Table;