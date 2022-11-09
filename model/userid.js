const mongoose= require('mongoose');

const userid= new mongoose.Schema({
    id:{
        type:String,
        unique:true
    }


});


const UserID= mongoose.model('UserID',userid);
module.exports=UserID;