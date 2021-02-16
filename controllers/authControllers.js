const User = require("../models/Users");
const { validationResult } = require('express-validator');
const jwt = require ('jsonwebtoken');
require('dotenv').config();
const nodemailer = require('nodemailer');
const bcrypt = require('bcrypt');
const Reset = require("../models/Reset");

exports.signup_post =  async (req, res) => {
    const {email , password} = req.body;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    await User.findOne({email}).exec((err, user) => {
        if (user) {
            return res.status(400).json({
                error : 'Cannot signup, user already exists'
            })
        }
    })

    try {
    let verifyCode = Math.random().toString();
    await User.create({email , password , verifyCode});
     {
      var transporter = nodemailer.createTransport({
          service : 'gmail' , 
        auth: {
          user: process.env.email,
          pass: process.env.emailpw
        }
      });

      
      const text = `<h1>Click the link below to register</h1>
    
      https://blog-auth-api.herokuapp.com/api/verification/?verify=${verifyCode}&email=${email}
` 

      const mailOptions = {
        from: `${process.env.email}`,
        to: req.body.email,
        subject: 'Registration',
        html: text
      };

      
      
      transporter.sendMail(mailOptions, function(err, info){
            if (err) {
                console.log(err);
            } else {
        console.log(info);
            }
        });
    }
    res.json({
      msg : 'User created , check email'
    })
  }
  catch(err) {
    console.log(err);
    res.json({
      message : 'couldnot create user'
    })
  } 
}

exports.login_post = async (req, res) => {
    const {email , password} = req.body;
    console.log(req.body);

    const user = await User.login(email , password);
    
    console.log(user);
    if ( user.isEmailVerified){
      jwt.sign({user} ,process.env.JWTsecret , (err, token) => {
      if (err) {
        console.log('cant make token');
      } else {
      res.json({token})
    }
    } )
  } else {
      res.json({
        err : 'verify email first'
      })
    }
} 

exports.changepw = async (req , res) => {
    
  console.log(process.env.JWTsecret); 
  req.data = jwt.verify(req.token , process.env.JWTsecret );
  const { oldpw , newpw , rnewpw } = req.body;
  console.log(req.data.user.email);

  if (newpw != rnewpw) {
    res.json({
      type : "error" , 
      msg : "Repeat password doesn't match"
    })
  }

  else {
    let det = await User.findOne({email: req.data.user.email} , "password")
    if (!await bcrypt.compare(oldpw , det.password)) {
      res.json ({
        err : "current password is incorrect"
      })
    } else {
      res.cookie('jwt', '', {maxAge : 1});
      const salt = await bcrypt.genSalt();
      await User.updateOne({email : req.data.user.email} , {$set : {password : await bcrypt.hash ( newpw, salt )}})
      res.json ({
        msg : "successfully updated , please log in now"
      })
    }
  }
}

exports.verification_get = async (req,res) => {

  console.log(req.query.verify);
  await User.findOneAndUpdate({$and : [{verifyCode : req.query.verify},{email : req.query.email}]} , {$set : {isEmailVerified : true}} )
  res.json ({
    msg: 'you are verified you can close the window now'
  })
}

exports.forgotpw_post = async (req,res) => {

  const email = req.body.email;
  const user = await User.findOne({email});

  if (user == null ) {
    res.json({
      error : 'Please enter a valid email'
    })
  } else {
    const forgotCode = Math.random().toString();

    await Reset.create({email , forgotCode});
    
    var transporter = nodemailer.createTransport({
      service : 'gmail' , 
    auth: {
      user: process.env.email,
      pass: process.env.emailpw
    }
  });
  
  const text = `<h1>To reset your password, please click the link below </h1>
    <br/>
    <h2>If this is not sent by you then please ignore the email</h2>

    http://localhost:3000/api/forgotpw2/?forgotCode=${forgotCode}&email=${email}
  ` 

    const mailOptions = {
      from: `${process.env.email}`,
      to: req.body.email,
      subject: 'Forgot Password',
      html: text
    };
    
    transporter.sendMail(mailOptions, function(err, info){
          if (err) {
              console.log(err);
          } else {
      console.log(info);
          }
      });
  }

    res.json({
      type : 'success' ,
      message : 'please check your email address to change password' 
    })   
}

exports.forgotpw_post2 = async (req,res,next) => {
  const email = req.query.email;
  const forgotCode = req.query.forgotCode;
  const password = req.body.password;
  const newpw = req.body.newpw;

  let check = await Reset.findOne({$and : [{forgotCode},{email}]}) ;
  
  if (check && password === newpw) {

  const salt = await bcrypt.genSalt();
  await Reset.remove({email})
  const user = await User.findOneAndUpdate({email} ,  {$set : {password: await bcrypt.hash(password, salt)}});
 
  jwt.sign({user} ,process.env.JWTsecret , (err, token) => {
    if (err) {
        console.log('cant make token');
    }
    res.json({token})
} )
}

  res.json ( {
    msg : 'Your password has been updated'
  })
}