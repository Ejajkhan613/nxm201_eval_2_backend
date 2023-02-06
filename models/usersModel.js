const mongoose = require("mongoose");


const userSchema = mongoose.Schema({
    "name": String,
    "username": String,
    "email": String,
    "role": {
        type: String,
        enum: ["customer", "manager"],
        default: "customer"
    },
    "password": String
})


const UserModel = mongoose.model("user", userSchema);


module.exports = { UserModel };