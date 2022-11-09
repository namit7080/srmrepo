
const Table= require('../model/table');
const Paper= require('../model/Researchpaper');
const Author= require('../model/singup');
const Authorinfo= require('../model/Reserachinfo');
module.exports.highCitation= async function(req,res){


     // sort on the basis of Citation  

     try{
    let sorted= await Table.find({}).sort({"citations":-1}).populate('author');

    return res.json(200, {
        message: sorted
      });
    }
    catch(e){
      return res.json(500, {
        message: "Servor Error"
      });
    }


}

module.exports.yearbetween=async function(req,res){

    try{
    let start= req.body.start;
    let end= req.body.end;

    // give paper and author in between year range
    let between=await Paper.find({ "publishyear" : { $gt :  start, $lt : end}});

    return res.json(200, {
        message: between
      });
    }

      catch(e){
        return res.json(500, {
          message: "Servor Error"
        });
      }

}


// search singup author on the basis of department

module.exports.departmentbasis= async function(req,res){

  try{

     let department= req.body.department;

     let depart= await Author.find({"department":department});

     return res.json(200, {
      message: depart
    });
  }

    catch(e){
      return res.json(500, {
        message: "Servor Error"
      });
    }


}

// search author detail by click on it

module.exports.authorinfo= async function(req,res){

  try{

  let id= req.body.info;

  let info= await Authorinfo.findOne({"_id":id}).populate('table');

  return res.json(200, {
   message: info
  });
  }

  catch(e){
    return res.json(500, {
      message: "Servor Error"
    });
  }



}


// search all paper of particular author

module.exports.allpaper= async function(req,res){


  try{
  let id= req.body.id;

  let paper= await Paper.find({"user":id});

  return res.json(200, {
   message: paper
  });
 }

  catch(e){
    return res.json(500, {
      message: "Servor Error"
    });
  }


}




