const express= require('express');
const port=7780;
const app= express();
const db= require('./config/mongoose');
const BodyParser=require('body-parser');

var cors = require('cors');



app.use(cors());

app.use(express.json())

app.use('/',require('./router'));
app.use(express.json({}));
app.use(BodyParser.json());

app.listen(port,function(err){
    if(err){
        console.log("Error "+err);
        return;
    }
    else{
        console.log("Server is running Fine");
    }
})