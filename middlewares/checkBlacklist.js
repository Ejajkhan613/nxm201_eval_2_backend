const express = require("express");

// Custom Models
const { BlacklistModel } = require("../models/blacklist");




const checkBlacklist = async (req, res, next) => {
    let token = req.headers.authorization;
    if (!token) {
        return res.send({ "message": "Please Provide Token first" });
    }

    try {
        let checking = await BlacklistModel.find({ "token": token });
        if (checking.length == 0) {
            next();
        } else {
            res.send({ "message": "Login first" });
        }

    } catch (error) {
        res.send({ "message": "Something went wrong", 'error': error });
    }
}


module.exports = { checkBlacklist };