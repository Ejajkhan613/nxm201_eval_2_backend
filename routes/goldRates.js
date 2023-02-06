const express = require("express");

// Custom Modules
const { checkToken } = require("../middlewares/tokencheck");
const { checkBlacklist } = require("../middlewares/checkBlacklist");


const goldRoute = express.Router();



// Gold Rates
goldRoute.get("/", checkToken,checkBlacklist, (req, res) => {
    res.send({ "message": "Gold Rates are here" });
})


module.exports = { goldRoute };