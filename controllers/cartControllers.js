const router = require('express').Router();
// const order = require('../models/order');
const Book = require('../models/book');


const cart = require("../models/cart.js");
//GET INDEX
router.get('/', async (req, res)=>{
    let allBooks = await Book.find({});
    res.render('./cart/index.ejs', {
        books:allBooks,
        carts : cart,
        currentUser: req.session.currentUser
    } )
})


//========================================
//  Add new Product in the chat using post request
//========================================
router.post('/', (req, res) =>{
    cart.push(req.body);
    res.redirect("/books");
  })

  //========================================
//  Remove Product from the chat using DELETE request
//========================================
// DELETE 
router.delete("/:id", (req, res)=>{
    const index = req.params.id;
    cart.splice(index, 1);
    if(cart.length==0){
        res.redirect("/books");
    }else{
        res.redirect("/carts");
    }
  })
module.exports = router;