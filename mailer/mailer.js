const nodemailer= require('../config/mailer');

// this is another way
exports.newComment= (email,otp)=>{
   

     nodemailer.transporter.sendMail({
        from:'namitvedwan16@gmail.com',
        to:email,
        subject:"OTP-Verification from SRM",
        html:'<h3>Hello </h3> <br/> Please Do not Share this Otp to anyone <br/> '+otp +'<br/>'


     },(err,info)=>{
        if(err)
        {
            console.log("Error in sedning mail " +err)
        }
        console.log("Message Sent ",info);
        return;
     })
}