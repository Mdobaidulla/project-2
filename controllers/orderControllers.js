const router = require('express').Router();
let carts = require("../models/cart.js");
const Order = require('../models/order.js')



router.get('/', async (req, res)=>{
    let allOrder = await Order.find({});
    res.render('./order/index.ejs', {
     orders: allOrder,
     currentUser: req.session.currentUser
    })
})


 //POST
//This route will add all the item from the shopping cart.
router.post('/', async (req, res) =>{
    const orderBody= [];
    carts.forEach(cart =>{
        orderBody.push({bookid:cart.bookid, quantity:cart.quantity, price:cart.price});
    })
    req.body.order=orderBody;
     let author = await Order.create(req.body);
   for(let i=0; i<=carts.length; i++){
       carts.pop();
   }
   carts.shift();
      res.redirect('./books');
 })


module.exports = router;