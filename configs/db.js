const mongoose = require("mongoose");


const connection = mongoose.connect(process.env.MongoDB_URL);


module.exports = { connection };