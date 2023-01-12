const mongoose= require('mongoose');
const global='mongodb+srv://puneet:bNtD1yFx5pj3IpA6@cluster0.i1ilmx0.mongodb.net/srmrepo?retryWrites=true&w=majority'

const DB12='mongodb://localhost/srmdb';
mongoose.connect(global);
const db= mongoose.connection;

db.on('error',console.error.bind(console,'Error Connecting to Database'));

db.once('open',function(){
     console.log('Connect to MongoDb Successfully');
});

module.exports=db;
