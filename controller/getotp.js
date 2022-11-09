var newOTP = require('otp-generators');
const OTP= require('../model/otp');
const mailer= require('../mailer/mailer');
module.exports.getotp= async function(req,res){

    try{

    let email= req.body.email;
    
    if(!email){
        return res.status(422).json({message:"invalid"});

    }

    let otptable= await OTP.findOne({email:email});
    if(otptable){

       await otptable.delete();
       
    }

  

        // generate random opt
        const otpcode=newOTP.generate(6, { alphabets: true, upperCase: false, specialChar: false });

        await OTP.create({
            email:email,
            code:otpcode
        });
      
        console.log(otpcode+" "+email);

        // send otp to user
        mailer.newComment(email,otpcode);
        return res.status(200).json({message:"Verify OTP"});
    }
    catch(e){
        return res.status(422).json({message:"invalid credential"});
        
    }


    


}