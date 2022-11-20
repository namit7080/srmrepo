const mongoose= require('mongoose');
const global='mongodb+srv://namit:teb6kwTYWhcF6cBK@cluster0.dfpjy9p.mongodb.net/srmdata?retryWrites=true&w=majority'

const DB1='mongodb://localhost/srmdb';
mongoose.connect(DB1);
const db= mongoose.connection;

db.on('error',console.error.bind(console,'Error Connecting to Database'));

db.once('open',function(){
     console.log('Connect to MongoDb Successfully');
});

module.exports=db;