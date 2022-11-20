const Table = require("../model/table");
const Paper = require("../model/Researchpaper");
const Author = require("../model/singup");
const Authorinfo = require("../model/Reserachinfo");
const Interest = require("../model/Interest");

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
    let type = req.query.departType?.toUpperCase();

    if (!department || !type) {
      return res.json(400, {
        message: "Invalid Request",
      });
    }
    const userid = [];
    if (type==="AREA OF INTEREST") {
      // getting interest on the basis of id and populate user
      //
      let name = department.trim().toUpperCase();
      let sameinterest = await Interest.findOne({ tittle: name }).populate(
        "user"
      );

      for (let i = 0; i < sameinterest.user.length; i++) {
        userid.push(sameinterest.user[i]._id.toString());
      }

      // get all paper of user
      let paper = await Paper.find({ user: { $in: userid } });
      let user = await Authorinfo.find({_id:{$in: userid}});

      return res.json(200, {
        message: user,
        allpaper: paper,
      });
    }
    if (type==="YEAR") {
      let index=department.split("-");
      let start = Number(index[0])-1;
      let end= Number(index[1])+1;
      const map = new Map();

      // get all paper in between range
      let between = await Paper.find({ publishyear: { $gt: Number(start), $lt: Number(end) } });

      for (let i = 0; i < between.length; i++) {
        if (!map.get(between[i].user.toString())) {
          userid.push(between[i].user.toString());
          
          map.set(between[i].user.toString(), true);
        }
      }

      // get user of paper

      let user = await Authorinfo.find({ _id: { $in: userid } });

      
      return res.json(200, {
        message: user,
        allpaper: between,
      });
    }
    let filter = department.trim().toUpperCase();
    

    // get author on the bais of department

    let allpaper = await Authorinfo.find({ department: filter }).exec();
    for (let i = 0; i < allpaper.length; i++) {
      userid.push(allpaper[i]._id);
    }

    // get paper on the basis department
    const paper = await Paper.find({ user: { $in: userid } });

    return res.json(200, {
      message: allpaper,
      allpaper: paper,
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
    // get table
    let table = await Table.findOne({ author: id });

    return res.json(200, {
      message: info,
      paper: papers,
      table: table,
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
    let paper = await Paper.find({}).sort({ cited: -1 }).populate("user");

    if (paper.length > 3) {
      paper = paper.slice(0, 3);
    }
    return res.json(200, {
      message: paper,
    });
  } catch (e) {
    return res.json(500, {
      message: "Servor Error",
    });
  }
};

module.exports.sameinterest = async function (req, res) {
  try {
    let interest = await Interest.find({});

    if (interest.length > 10) {
      interest = interest.slice(0, 10);
    }

    console.log(interest);
    return res.json(200, {
      message: interest,
    });
  } catch (e) {
    return res.json(500, {
      message: "Servor Error",
    });
  }
};

// search paper

module.exports.serchpaper = async function (req, res) {
  try {
    let payload = await req.query.id.trim();

    if (!payload) {
      return res.json(400, {
        message: "Invalid Request",
      });
    }

    let interest = await Paper.find({
      tittle: { $regex: new RegExp("^" + payload + ".*", "i") },
    }).exec();

    console.log(interest);
    return res.json(200, {
      message: interest,
    });
  } catch (e) {
    return res.json(500, {
      message: "Servor Error",
    });
  }
};

module.exports.differentsearch = async function (req, res) {

  try{
  let id = req.query.id;
  let type = req.query.departType?.toUpperCase();

  let payload = req.query.p;
  if(!id||!type){
    return res.json(400, {
      message: "Invalid Request",
    });
  }
  const userid = [];

  if (type === "DEPARTMENT") {
    let newid = id.trim().toUpperCase();

    let author = await Authorinfo.find({ department: newid }).exec();

    for (let i = 0; i < author.length; i++) {
      userid.push(author[i]._id);
    }

    // get paper on the basis department
    let paper = await Paper.find({
      user: { $in: userid },
      tittle: { $regex: new RegExp("^" + ".*" + payload + ".*", "i") },
    }).exec();
    let auth = await Authorinfo.find({
      department: newid,
      name: { $regex: new RegExp("^" + ".*" + payload + ".*", "i") },
    }).exec();

    return res.json(200, {
      message: auth,
      allpaper:paper
    });

   
  }
  if(type==="AREA OF INTEREST"){
    let name = id.trim().toUpperCase();
      let sameinterest = await Interest.findOne({ tittle: name }).populate(
        "user"
      );

      for (let i = 0; i < sameinterest.user.length; i++) {
        userid.push(sameinterest.user[i]._id.toString());
      }

      // get all paper of user
      
      let allpaper = await Paper.find({ user: { $in: userid } ,tittle: { $regex: new RegExp("^" + ".*" + payload + ".*", "i") }});
      let allauth= await Authorinfo.find({_id:{$in: userid},name: { $regex: new RegExp("^" + ".*" + payload + ".*", "i") }});
      return res.json(200, {
        message: allauth,
        allpaper:allpaper
      });
      
  }
  if(type==="YEAR"){
    let index=id.split("-");
    let start = Number(index[0])-1;
    let end= Number(index[1])+1;

    if(!index||!start||!end){

    }

    const map = new Map();

    // get all paper in between range
    let between = await Paper.find({ publishyear: { $gt: Number(start), $lt: Number(end) } });

    for (let i = 0; i < between.length; i++) {
      if (!map.get(between[i].user.toString())) {
        userid.push(between[i].user.toString());
       
        map.set(between[i].user.toString(), true);
      }
    }

    // get user of paper

    let user = await Authorinfo.find({ _id: { $in: userid }, name: { $regex: new RegExp("^" + ".*" + payload + ".*", "i") }});
    let paper= await Paper.find({ publishyear: { $gt: start, $lt: end },tittle: { $regex: new RegExp("^" + ".*" + payload + ".*", "i") } });
    return res.json(200, {
      message: user,
      allpaper:paper
    });
  }
  else{
    return res.json(400, {
      message: "Invalid Request",
    });
  }
}
catch(e){
  console.log(e);
  return res.json(500, {
    message: "Server erroe",
  });
}
 
};
