const router = require('express').Router();
const Book = require('../models/book');
const Author= require('../models/author');
const cart = require("../models/cart.js");
//******image Upload******** */
let fs = require('fs'); 
let path = require('path'); 
//require('dotenv/config');
let multer = require('multer'); 

let storage = multer.diskStorage({ 
    destination: (req, file, cb) => { 
        cb(null, 'uploads') 
    }, 
    filename: (req, file, cb) => { 
        cb(null, file.fieldname + '-' + Date.now()) 
    } 
}); 
let upload = multer({ storage: storage }); 

//**********Image Upload */





//Verifying authenticated session
const isAuthenticated = (req, res, next) => {
    if (req.session.currentUser) {
      return next()
    } else {
      res.redirect('/sessions/new')
    }
  }



//GET INDEX
router.get('/', async (req, res)=>{
    let allBooks = await Book.find({});
    res.render('./book/index.ejs', {
        books : allBooks,
        currentUser: req.session.currentUser,
        carts: cart,
    } )
})
//NEW
//This should show a new form to add a new Book
router.get('/new', async (req, res) =>{
    let allAuthors = await Author.find({});
    res.render('book/new.ejs', {
        authors: allAuthors,
        currentUser: req.session.currentUser
    })
  })

// EDIT
//This route will retrive all the value from book and author collection and 
// put on edit from so user will be able to update the value
router.get('/:id/edit', async (req, res) => {
    let allAuthors = await Author.find({});
    let foundBook = await Book.findById(req.params.id).populate('authors');
    res.render('book/edit.ejs',  {
        book: foundBook,
        authors: allAuthors,
        currentUser: req.session.currentUser
    })
  })
  


//SEED
//this is a seed file for populating author and book
router.get('/seed', async (req, res) =>{
//CREATING TREE AUTHORS
const giladBracha= await Author.create({
    name: 'Gilad Bracha'
})
const tonyGaddis= await Author.create({
    name: 'Tony Gaddis'
})
const herbertSchildt= await Author.create({
    name: 'Herbert Schildt'
})
//CREATING A NEW BOOK
const startingOutWithJava = new Book({
    title: 'Starting Out With Java',
    authors: [],
    price:45,
    image: 'https://res.cloudinary.com/dpggpg7su/image/upload/v1604089814/books/java_qid4ly.jpg',
});
//pushing the authors in book arrays
startingOutWithJava.authors.push(giladBracha);
startingOutWithJava.authors.push(tonyGaddis);
startingOutWithJava.authors.push(herbertSchildt);
startingOutWithJava.save(function (err, savestartingOutWithJava){
    if(err){
        console.log(err);
    }else{
        console.log(startingOutWithJava);
    }
  });
  res.send(startingOutWithJava);
});




//SHOW
router.get('/:id', async (req, res) => {
    let allAuthors = await Author.find({});
    let foundBook = await Book.findById(req.params.id).populate('authors');
    let allAuthorsForChecklist = allAuthors.filter((author) => {
        if (!foundBook.authors.map((book) => book.id).includes(author.id)) {
          return author;
        }
      });
    res.render('book/show.ejs',  {
        book: foundBook,
        authors: allAuthorsForChecklist,
        currentUser: req.session.currentUser
    });
});



//POST
//This route will add the body in book collection
router.post('/',upload.single('image'), async (req, res) =>{
    //*************Image upload */
    var img = fs.readFileSync(req.file.path);
    var encode_image = img.toString('base64');
    var finalImg = {
        contentType: req.file.mimetype,
        data:Buffer.from(encode_image, 'base64'), 
        path: req.file.path,
     };
     req.body.image=finalImg;
     //**********image upload */
    let book = await Book.create(req.body);
    //**********The Uploaded file will be removed from Upload folder
    //after adding the binary image in database Image */
    fs.unlink(req.file.path, (err) => {
        if (err) {
          console.error(err)
          return
        }
      console.log("The file is removed");
      })
      //Re-directing to the Home page
     res.redirect(`/books`)
 })



 //PUT
 //This route will Allow user to update the author list
 router.put('/:bookId', async (req, res) => {
     let book =await Book.findByIdAndUpdate({_id:req.params.bookId},
        {
            authors : req.body.authors,
            title : req.body.title

        },
        (error, updated)=>{
         if(error){
             console.log(error);
         }else{
             console.log(updated);
         }
     })
     res.redirect(`/books/${req.params.bookId}`);
   });



//DELETE
router.delete('/:id', async (req, res) =>{
    let foundBook= await Book.findByIdAndRemove(req.params.id,{
        
    });
    res.redirect('/books');
})
module.exports = router;