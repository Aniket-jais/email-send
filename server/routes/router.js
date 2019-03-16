const { ObjectId } = require("mongodb");
const express = require('express');
const router = express.Router();
const app = express();
const form = require('../models/signForm');
const joi = require('joi');
const bcrypt = require("bcrypt");
const schema = joi.object().keys({
    password: joi.string().regex(/^[a-zA-Z0-9]{8,30}/),
    confirmPassword: joi.string().regex(/^[a-zA-Z0-9]{8,30}/)
});
const jwt = require("jsonwebtoken");
const checkAuth = require('../middlewares/check-auth');
var nodemailer = require('nodemailer');
const htmlToText = require('html2plaintext');
var transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
        user: 'aniket.jaiswal142006@gmail.com',
        pass: '######'
    }
});
email='';

router.post("/postForm",(req, res, next) => {
    
       // console.log(req.body.firstName);
        const result = joi.validate({password:req.body.password,confirmPassword:req.body.confirmPassword},schema);
        if(result.error == null && req.body.password==req.body.confirmPassword){
            bcrypt.hash(req.body.password,10).then(hash=>{
               // var signUpData = new form(req.body);
               const signUpData = new form({
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                email: req.body.email, 
                mobileNumber:req.body.mobileNumber,
                dateOfBirth:req.body.dateOfBirth,
                password:hash,
                confirmPassword:hash
               });
               signUpData.save().then(result=>{
                   //message: "user created",
                   res.send(signUpData);
                  console.log(result);
                  var mailOptions = {
                    from: 'aniket.jaiswal142006@gmail.com', 
                    to: result.email, 
                    subject: 'signUp with-sellMobiles', 
                    text: 'succesfully registered with sell mobiles ', 
                    html: '<b>succesfully registered with sell mobiles </b>' 
                };
                
                
                transporter.sendMail(mailOptions, function(error, info){
                    if(error){
                        return console.log(error);
                    }
                
                    console.log('Message sent: ' + info.response);
                });


               });
               
            }).catch(err=>{
                res.status(500).json({
                    error:err
                })
            })

           // console.log("sign up is in process");
            
           
        }
        else{
            console.log("error in pass");
        }
        // await form.create(req.body);
        //     res.send(req.body);
        

    }
    

);

router.post("/postSignIn", async (req, res, next) => {
    let fetchedAuth;
    // console.log(req.body.email);
    // console.log(req.body.password);
    try {
        
        await form.findOne({ email: req.body.email }).then(auth=>{
            
            if(!auth){
                return res.status(404).json({
                    message:"email not found",
                })
            }
            fetchedAuth = auth;
            return bcrypt.compare(req.body.password , auth.password);
            
        }).then(genuinePassword=>{
            //console.log("matches");
            if(!genuinePassword){
                return res.status(401).json({
                    message:"password not matched",
                })
            }
            
                console.log("hi");
                const token = jwt.sign(
                    {email: fetchedAuth.email ,mobileNumber: fetchedAuth.mobileNumber},
                    'secret_this_should_be_longer',
                    {expiresIn:"1h"}
                    );
                    res.status(200).json({
                        token : token,
                    })
            
        
                //res.send(genuinePassword);
                //console.log(genuinePassword);
            
            
            //console.log(auth)
        })
        }
    
    catch (err) {
        console.log("error in try");
    }

});

// router.post("/forgotPassword", async (req, res, next) => {
//    // let fetchedAuth;
//     // console.log(req.body.email);
//     // console.log(req.body.password);
//     try {
        
//         await form.findOne({ email: req.body.email }).then(auth=>{
            
//             if(!auth){
//                 return res.status(404).json({
//                     message:"email not found",
//                 })
//             }
//             this.email = req.body.email;
//             console.log(auth);
//             var mailOptions = {
//                 from: 'aniket.jaiswal142006@gmail.com', 
//                 to: auth.email, 
//                 subject:'Password recovery - sellMobiles', 
//                 text: 'click this to reset your password : http://localhost:4200/resetPassword', 
             
//                 html: '<b>click this to reset your password : http://localhost:4200/resetPassword </b>' 
//             };
            
            
//             transporter.sendMail(mailOptions, function(error, info){
//                 if(error){
//                     return console.log(error);
//                 }
            
//                 console.log('Message sent: ' + info.response);
//             });
               
        
//                 //res.send(genuinePassword);
//                 //console.log(genuinePassword);
            
            
//             //console.log(auth)
//         })
//         }
    
//     catch (err) {
//         console.log("error in try baby");
//     }

// });

router.post("/forgotPassword", async (req, res, next) => {
    // let fetchedAuth;
     // console.log(req.body.email);
     // console.log(req.body.password);
     try {
         
         await form.findOne({ email: req.body.email }).then(auth=>{
             
             if(!auth){
                 return res.status(404).json({
                     message:"email not found",
                 })
             }
             this.email = req.body.email;
             console.log(auth);
            // const emailText = htmlToText('<a href="http://localhost:4200/resetPassword">reset</a>')
             
             var mailOptions = {
                 from: 'aniket.jaiswal142006@gmail.com', 
                 to: auth.email, 
                 subject:'Password recovery - sellMobiles', 
                 text: `click this to reset your password : '<a href="http://localhost:4200/resetPassword">reset</a>'`, 
              
                 html: `<b>click this to reset your password : <a href="http://localhost:4200/resetPassword">reset</a></b>
                 <p>If this is not you please ignore it</p>`
             };
             
             
             transporter.sendMail(mailOptions, function(error, info){
                 if(error){
                     return console.log(error);
                 }
             
                 console.log('Message sent: ' + info.response);
             });
                
         
                 //res.send(genuinePassword);
                 //console.log(genuinePassword);
             
             
             //console.log(auth)
         })
         }
     
     catch (err) {
         console.log("error in try baby");
     }
 
 });
 
 




     
    router.put("/resetPassword",(req, res, next) => {
        console.log("aniket");
        console.log(this.email);
        // console.log(req.body.firstName);
         //const result = joi.validate({password:req.body.password,confirmPassword:req.body.confirmPassword},schema);
         if( req.body.password==req.body.confirmPassword){
             bcrypt.hash(req.body.password,10).then(hash=>{
                // var signUpData = new form(req.body);
                
              
    
                form.findOne({ email: this.email }, function (err, result){
                    //console.log(result.email);
                    result.password = hash;
                    result.confirmPassword = hash;
                    
                    result.save();
                    this.email='';
                  });
    
             });
        
    
                
        }
    });



module.exports = router;