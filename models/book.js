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
    } ,
    price :{
        type: Number,
        required:true,
    },
    userid:{
        type:String,
        // type:mongoose.Schema.Types.ObjectId,
        // ref: 'User',
    }
}, 
{ timestamps: true });
module.exports = mongoose.model('Book', bookSchema);