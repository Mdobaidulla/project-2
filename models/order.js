const mongoose = require('mongoose');
const orderSchema = new mongoose.Schema({
    products:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Book',
      },
    ],
    quantity: {
        type: Number,
        required: true,
    },
   },
   {
       timestamps: true
   });
   
module.exports = mongoose.model("Order", orderSchema);
