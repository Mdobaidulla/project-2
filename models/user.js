const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    security: {
        type: String,
        required: true,
    },
    isActive: {
        type: Boolean,
        default: false,
    }
   },
   {
       timestamps: true
   });
   
module.exports = mongoose.model("User", userSchema);
