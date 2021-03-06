const bcrypt = require('bcrypt')
const express = require('express')
const router = express.Router()
const User = require('../models/user.js')
const nodeMailer = require('nodemailer')
const user = require('../models/user.js')

router.get('/new', (req, res) => {
   res.render('user/new.ejs', {
     currentUser: req.session.currentUser
    })
})
//GET
//Getting the email submit form 
router.get('/reset', (req, res) =>{
  res.render('user/reset.ejs', {
    currentUser: req.session.currentUser
   })
})

//GET
//Getting the password reset from to submit
router.get('/resetpassword', async (req, res) =>{
  res.render('user/resetpassword.ejs', {
    currentUser: req.session.currentUser
   })
 })


//Need to complete for updating the user's registration body. 
router.get('/verify', async (req, res) =>{
     let allusers = await User.find({});
    res.render('user/edit.ejs', {
      users: allusers,
      currentUser: req.session.currentUser
     })
   // res.send('verify link is working')
})
//Complete the user registration 
router.put('/verify', async (req, res) =>{
  try{
   let oneUser = await User.findOne({username:req.body.username, security:req.body.security});
   let randomNumber=Math.floor(100000 + Math.random() * 900000)
   if(oneUser){
     await User.updateOne({username:req.body.username}, {isActive: true, security: randomNumber}, (error, updated) =>{
        if(error){
          console.log(error);
        }else{
          console.log(updated);
        }
     })
   }else{
     
    res.send("<a href='/users/reset'>Invalid username or security code</a>")
   }
  }catch(error){
      console.log("Error from users/verify"+ error);
  }
  res.redirect('/sessions/new')
})
//POST for creating a new account
router.post('/', (req, res) => {
  //overwrite the user password with the hashed password, then pass that in to our database
  let securityCode= Math.floor(100000 + Math.random() * 900000);
  
    req.body.password = bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10))
    req.body.security=securityCode;
    req.body.isActive= false;
    console.log(req.body);
    User.create(req.body, (error, createdUser) => {
      if(error){
        console.log(error);
      }
      //adding this for sending email
      let transporter = nodeMailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
            // should be replaced with real sender's account
            //user: 'mitulsunny8',
            user: process.env.GMAIL_SMTP_USER,
            //pass: '7416Mitul'
            pass: process.env.GMAIL_SMTP_PASSWORD
        }
    });
    
    let mailOptions = {
        // should be replaced with real recipient's account
        to: req.body.username,
        subject: "Md's Book's Store Registration",
        html: "Dear "+req.body.name+" <a href='https://md-project2.herokuapp.com/users/verify'>Click</a> on this link  and enter your email and use the security code "+ securityCode +" to complete the registration"
    };
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.log(error);
            res.end(error)
        }else{
        console.log('Message %s sent: %s', info.messageId, info.response);
        res.end("sent");

        }
    });
   
//Until this we are sending email to the customer
      res.redirect('/sessions/new');
    })
})


//PUT for sending a new security code for reset password
router.put('/reset', async (req, res) =>{
try{
  let securityCode= Math.floor(100000 + Math.random() * 900000);
  let oneUser = await User.findOne({username:req.body.username});
   if(oneUser){
await User.updateOne({username:req.body.username}, {isActive: true, security: securityCode}, (error, updated) =>{
  if(error){
    console.log(error);
  }else{
    console.log(updated);
  }
})
   //adding this for sending email
   let transporter = nodeMailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
        user: process.env.GMAIL_SMTP_USER,
        pass: process.env.GMAIL_SMTP_PASSWORD
    }
});

let mailOptions = {
    // should be replaced with real recipient's account
    to: req.body.username,
    subject: "Md's Book's Store Password Reset",
    html: " <br><a href='https://md-project2.herokuapp.com/users/resetpassword'>Click</a> on this link  and enter the security code "+ securityCode +" to complete the password reset"
};
transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
        res.end(error)
    }else{
    console.log('Message %s sent: %s', info.messageId, info.response);
    res.end("<a href='/users/resetpassword' >An email with security code is sent to your email, Enter security code to reset your password</a>");

    }
});
   }else{
     res.send("<a href='/users/reset'>'User does not exist'</a>")
   }
  }catch(error){
    res.send("There is an erorr in your reset password email, The email does not exist!!!")
  }
})

//PUT for resetting password and adding new password in the database
router.put('/resetpassword', async (req, res) =>{
  let securityCode= Math.floor(100000 + Math.random() * 900000);
  let oneUser = await User.findOne({username:req.body.username});
  if(oneUser){
   await User.updateOne(
     {
       username:req.body.username
    }, {
     password: bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10)),
     security:securityCode
    }, (error, updated) =>{
    if(error){
      console.log(error);
    }else{
      res.redirect("/sessions/new")
      console.log("Updating for password : "+updated);
    }
  })
  }else{
    console.log('Something went wrong!!!');
  }

})
module.exports = router;