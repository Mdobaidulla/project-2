const mongoose = require('mongoose');
const bookSchema = new mongoose.Schema({
    title: {
        type: String, 
        required: true,
        unique: true
    },
    authors:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Author',
    },
   ],
    image: {
        type: String,
    }
});
module.exports = mongoose.model('Book', bookSchema);