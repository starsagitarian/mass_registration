const mongoose = require('mongoose');


const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please enter your name!"],
        trim: true
    },
    number: {
        type: Number,
        required: [true, "Please enter your phone number!"],
        trim: true,
        unique: true
    },
    email: {
        type: String,
        required: [true, "Please enter your email address!"],
        unique: true
    },
    password: {
        type: String,
        required: [true, "Please create a valid password!"],
    },
    role: {
        type: Number,
        default: 0 // 0 -> normal user, 1 -> admin
    },
    avatar: {
        type: String,
        default: "https://res.cloudinary.com/starsagitarian/image/upload/v1610036877/avatar_default_ae2njy.png"
    },
    date: {
        type: Date,
        default: Date.now()
    },
    members: {
        type: Number,
        default: 1
    },
    time : { 
        type: Number, 
        default: (new Date()).getTime() 
    } 

}, {
        timestamps: true
    })
module.exports = mongoose.model("Users", userSchema);
