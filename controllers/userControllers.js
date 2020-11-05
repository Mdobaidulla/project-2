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
   let oneUser = await User.findOne({username:req.body.username, security:req.body.security});
   let randomNumber=Math.floor(100000 + Math.random() * 900000)
   if(oneUser){
         req.body.username=oneUser.username;
         req.body.password=oneUser.password;
         req.body.name=oneUser.name;
         req.body.isActive=true;
         req.body.security=randomNumber;
     await User.updateOne(req.body, (error, updated) =>{
        if(error){
          console.log(error);
        }else{
          console.log(updated);
        }
     })
   }else{
     console.log("You have invalid info");
   }
  res.redirect('/sessions/new')
})

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
            user: 'mitulsunny8',
            pass: '7416Mitul'
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
module.exports = router;