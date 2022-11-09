
// const Explore = require('../model/Research');
// const Profile = require('../model/Profile');


// module.exports.Explore= async function(req,res){

    
//     const research=await Explore.find({});
//     console.log(research);

//      return res.json(200,{
//         message:research 
//     })


// }

// module.exports.Different= async function(req,res){

//     console.log("Get");
  
//     const research=await Explore.find({department:req.body.data});
//     console.log(research);

//      return res.json(200,{
//         message:research 
//     })


// }

// module.exports.Authors= async function(req,res){

//     console.log("Get");
  
//     const author=await Profile.find({department:req.body.data});
//     console.log(author);

//      return res.json(200,{
//         message:author
//     })


// }

// module.exports.ExplProfile= async function(req,res){

//     console.log("Get");
  
//     const author=await Profile.find({_id:req.body.data});
//     console.log(author);

//      return res.json(200,{
//         message:author
//     })


// }