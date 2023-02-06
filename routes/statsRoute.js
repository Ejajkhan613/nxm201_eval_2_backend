const express = require("express");

// Custom Modules
const { checkRole } = require("../middlewares/checkRole");
const { checkBlacklist } = require("../middlewares/checkBlacklist");


const userStatsRoute = express.Router();



// Gold Rates
userStatsRoute.get("/", checkRole,checkBlacklist, (req, res) => {
    res.send({ "message": "User Stats are here" })
})


module.exports = { userStatsRoute };