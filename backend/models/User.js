const mongoose = require("mongoose");
const { Schema } = mongoose;

const UserSchema = new Schema({
    username:{
        type: String,
        required: true
    },
    name:{
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true
    },
    password:{
        type: String,
        required: true
    },
    address:{
        type: String,
        required: true
    },
    phone: {
        type: Number,
        required: true
    }
});

const User = mongoose.model('user', UserSchema);
module.exports = User;