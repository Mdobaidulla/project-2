const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    order:[
        {
        bookid: String,
        quantity: Number,
        price: Number,
        }
    ]
   },
   {
       timestamps: true
   });
module.exports = mongoose.model("Order", orderSchema);
