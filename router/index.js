const express= require('express');
const Researchpaper = require('../model/Research');

const router= express.Router();
const Explore= require('../controller/index');
const Profile = require('../model/Profile');
const Interest= require('../controller/interest');
const Filter= require('../controller/filter');
const Getotp= require('../controller/getotp');

const api= require('../controller/api');



router.post('/data',function(req,res){

    console.log(req.body);
    const name= req.body.paper;
    const post=req.body.author;
    const paper= req.body.department;
    const department= req.body.journal;
     const email=req.body.issn;
    const password=req.body.journallink;
    

     Profile.create({
        name:name,
        post:post,
       
        department:department,
        email:email,
       password:password
    
        
     })
     return res.json(200,{
        message: "Created"
    })


})


router.get('/explore',Explore.Explore);
router.post('/exploredept',Explore.Different);
router.post('/authors',Explore.Authors);
router.post('/exploreprofile',Explore.ExplProfile);

router.post('/api',api.save);

router.post('/sameinterest',Interest.Sameintrest);

router.get('/citation',Filter.highCitation);

router.post('/yearbetween',Filter.yearbetween);

router.post('/getotp',Getotp.getotp);

// searching author on the department basis
router.post('/department',Filter.departmentbasis);

// search author detail by click on it
router.post('/authordetail',Filter.authorinfo);

// search all paper of particular author
router.post('/allpaper',Filter.allpaper);







module.exports=router;