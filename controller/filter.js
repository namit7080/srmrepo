const Table = require("../model/table");
const Paper = require("../model/Researchpaper");
const Author = require("../model/singup");
const Authorinfo = require("../model/Reserachinfo");
const Interest= require('../model/Interest');

module.exports.highCitation = async function (req, res) {
  // sort on the basis of Citation

  try {
    let sorted = await Table.find({})
      .sort({ citations: -1 })
      .populate("author");

    if (sorted.length > 6) {
      sorted = sorted.slice(0, 6);
    }

    console.log("Yess");

    return res.json(200, {
      message: sorted,
    });
  } catch (e) {
    return res.json(500, {
      message: "Servor Error",
    });
  }
};

module.exports.yearbetween = async function (req, res) {
  try {
    let start = req.body.start;
    let end = req.body.end;
    if (!start || !end) {
      return res.json(400, {
        message: "Invalid Request",
      });
    }

    // give paper and author in between year range
    let between = await Paper.find({ publishyear: { $gt: start, $lt: end } });

    return res.json(200, {
      message: between,
    });
  } catch (e) {
    return res.json(500, {
      message: "Servor Error",
    });
  }
};

// search singup author on the basis of department

module.exports.departmentbasis = async function (req, res) {
  try {
    let department = req.query.id;
    let type = req.query.type;
   
    if (!department||!type ) {
      return res.json(400, {
        message: "Invalid Request",
      });
    }
    const userid=[];
    if(type==="INTEREST"){

       // getting interest on the basis of id and populate user
        let sameinterest= await Interest.findOne({_id:department}).populate('user');
       
        for(let i=0;i<sameinterest.user.length;i++){
          userid.push(sameinterest.user[i]._id.toString());
        }
  
        // get all paper of user
         const paper= await Paper.find({user:{ $in: userid}});
         
         return res.json(200, {
          message: sameinterest,
          allpaper:paper
        });

    }
    if(type==="RANGE"){
        let index=department.indexOf("_");
        let start = department.slice(0,index);
        let end= department.slice(index+1);
        const map = new Map();


        // get all paper in between range
        let between = await Paper.find({ publishyear: { $gt: start, $lt: end } });
       

        for(let i=0;i<between.length;i++){
          
            if(!map.get(between[i].user.toString())){
                userid.push(between[i].user.toString());
                console.log(between[i].user.toString());
                map.set(between[i].user.toString(),true);
            }
        }

        // get user of paper

        let user = await Authorinfo.find({_id:{$in: userid}});


        console.log(start+" "+end+" "+index);
        return res.json(200, {
          message: user,
          allpaper:between
        });




    }
    let filter = department.trim().toUpperCase();
    console.log(filter);

    // get author on the bais of department
    
    let allpaper = await Authorinfo.find({ department: filter }).exec();
    for(let i=0;i<allpaper.length;i++){
        userid.push(allpaper[i]._id);
    }

    // get paper on the basis department
    const paper= await Paper.find({user:{ $in: userid}});
   

    return res.json(200, {
      message: allpaper,
      allpaper:paper
    });

  } catch (e) {
    return res.json(500, {
      message: "Servor Error",
    });
  }
};

// search author detail by click on it
module.exports.authorinfo = async function (req, res) {
  try {
   
    let id = req.query.id;

    
    if (!id) {
      return res.json(400, {
        message: "Invalid Request",
      });
    }

    // get particular single author
    let info = await Authorinfo.findOne({ _id: id });
    // get all paper
    let papers = await Paper.find({ user: id });
    
    

    return res.json(200, {
      message: info,
      paper: papers,
    });
  } catch (e) {
    return res.json(500, {
      message: "Servor Error",
    });
  }
};

// search all paper of particular author

module.exports.allpaper = async function (req, res) {
  try {
    let id = req.query.userid;
    if (!id) {
      return res.json(400, {
        message: "Invalid Request",
      });
    }

    let paper = await Paper.find({ user: id });

    return res.json(200, {
      message: paper,
    });
  } catch (e) {
    return res.json(500, {
      message: "Servor Error",
    });
  }
};


module.exports.sameinterest= async function(req,res){

  try{
    let interest= await Interest.find({});

    if(interest.length>10){
      interest= interest.slice(0, 10);
    }

    console.log(interest);
    return res.json(200, {
      message: interest,
    });
  }
  catch(e){
    return res.json(500, {
      message: "Servor Error"
    });
  }


}

// search paper

module.exports.serchpaper= async function(req,res){

    try{


      let payload=await req.query.id.trim();

      if(!payload){
        return res.json(400, {
          message: "Invalid Request",
        });
      }


       let interest=await Paper.find({ tittle:{$regex: new RegExp('^'+payload+'.*','i')}}).exec();

       console.log(interest);
       return res.json(200, {
        message:interest,
      });

    }
    catch(e){
      return res.json(500, {
        message: "Servor Error"
      });
    }



}
