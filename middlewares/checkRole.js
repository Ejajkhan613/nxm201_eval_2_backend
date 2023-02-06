const express = require("express");
const { UserModel } = require("../models/usersModel");
const jwt = require("jsonwebtoken");
require('dotenv').config()

const normalKey = process.env.normalTokenKey;


const checkRole = async (req, res, next) => {
    let token = req.headers.authorization;
    if (!token) {
        return res.send({ "message": "Not Authorized" });
    }


    try {
        jwt.verify(token, normalKey, async (err, decoded) => {
            if (decoded) {
                const check = await UserModel.find({ "username": decoded.username });
                if (check.length == 1) {
                    if (check[0].email == decoded.email && check[0].role == decoded.role) {
                        next();
                    } else {
                        res.send({ "message": "Not Authorized" });
                    }
                } else {
                    res.send({ 'message': "Username is already registered please provide different" });
                }
            } else {
                res.send({ "message": "Not Authorized" });
            }
        });

    } catch (error) {
        res.send({ "message": "Something went wrong", 'error': error });
    }
}


module.exports = { checkRole };