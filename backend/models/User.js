const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        match: /^[0-9]{10}$/,
        required: true
    },
    location: String

});

const UserModel = mongoose.model("User", userSchema);

module.exports = UserModel;