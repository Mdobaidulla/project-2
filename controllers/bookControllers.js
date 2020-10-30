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
    image: 'this should be a link',
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
    })
})




module.exports = router;