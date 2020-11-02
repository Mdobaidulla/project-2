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
        data: Buffer, 
        contentType: String,
        path: String, 
    } 
});
module.exports = mongoose.model('Book', bookSchema);