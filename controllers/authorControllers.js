const router = require('express').Router();
const Author= require('../models/author');



//NEW
//This should show a new form to add a new Author
router.get('/new', async (req, res) =>{
    let allAuthors = await Author.find({});
    res.render('author/new.ejs', {
        authors: allAuthors,
        currentUser: req.session.currentUser,
    })
  })

 //POST
//This route will add the body in author collection
router.post('/', async (req, res) =>{
    console.log(req.body);
     let author = await Author.create(req.body)
     res.redirect("/books")
     
 })

  module.exports = router;