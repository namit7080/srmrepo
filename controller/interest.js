
const Interest= require('../model/Interest');

module.exports.Sameintrest= async function(req,res){

    // Payload Search
    let payload=await req.body.payload.trim();
    // let interest=await Interest.find({ tittle:{$regex: new RegExp('^'+payload+'.*','i')}}).exec();
    let interest= await Interest.find({ tittle:{$regex: new RegExp('^'+'.*'+payload+'.*','i')}}).populate('user');
    return res.json(200, {
        message: interest
      });
     

}