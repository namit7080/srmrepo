const express= require('express');
const port=7780;
const app= express();
const db= require('./config/mongoose');

var cors = require('cors');


app.use(cors());

app.use(express.json())

app.use('/',require('./router'));


app.listen(port,function(err){
    if(err){
        console.log("Error "+err);
        return;
    }
    else{
        console.log("Server is running fine");
    }
})