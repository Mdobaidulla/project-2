const bcrypt = require('bcrypt')
const express = require('express')
const router = express.Router()
const User = require('../models/user.js')

router.get('/new', (req, res) => {
   res.render('user/new.ejs', {
     currentUser: req.session.currentUser
    })
})
router.post('/', (req, res) => {
  //overwrite the user password with the hashed password, then pass that in to our database
    req.body.password = bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10))
    console.log(req.body);
    User.create(req.body, (error, createdUser) => {
      res.redirect('/sessions/new')
    })
})
module.exports = router;