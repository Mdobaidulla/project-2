const router = require('express').Router();
const Book = require('../models/book');
const Author= require('../models/author');




//GET
router.get('/', async (req, res)=>{
    let allBooks = await Book.find({});
    res.render('./book/index.ejs', {
        books : allBooks
    } )
})

//NEW
//This should show a new form to add a new movie
router.get('/new', async (req, res) =>{
    let allAuthors = await Author.find({});
    res.render('book/new.ejs', {
        authors: allAuthors,
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
        authors: allAuthorsForChecklist
    });
});




//POST
//This route will add the body in book collection
router.post('/', async (req, res) =>{
    console.log(req.body);
     let book = await Book.create(req.body)
     res.redirect(`/books`)
 })



 //PUT
 //This route will Allow user to update the author list
 router.put('/:bookId', async (req, res) => {
     let foundBook = await Book.findById(req.params.bookId);
         foundBook.authors=req.body.authors; 
         foundBook.image= req.body.image;
         foundBook.title= req.body.title;
         await Book.update(foundBook);
    res.redirect(`/books/${foundBook.id}`);
  });

//DELETE
router.delete('/:id', async (req, res) =>{
    let foundBook= await Book.findByIdAndRemove(req.params.id,{
        
    });
    res.redirect('/books');
})
module.exports = router;