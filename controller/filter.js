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
    if(type==="INTEREST"){
          let sameinterest= await Interest.find({_id:department}).populate({path:'user', populate:{
          path:'papers'
     }});
         return res.json(200, {
          message: sameinterest,
        });

    }
    let filter = department.trim().toUpperCase();
    
    let allpaper = await Authorinfo.find({ department: filter }).populate(
      "papers"
    );


    return res.json(200, {
      message: allpaper,
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
    console.log(req.params);
    let id = req.query.id;

    console.log(id);
    if (!id) {
      return res.json(400, {
        message: "Invalid Request",
      });
    }

    let info = await Authorinfo.findOne({ _id: id });
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
