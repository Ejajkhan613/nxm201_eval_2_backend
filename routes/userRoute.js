const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// Custom Modules
const { checkUsernameAndemail } = require("../middlewares/checkusername");
const { UserModel } = require("../models/usersModel");
const { BlacklistModel } = require("../models/blacklist");


const userRoute = express.Router();
userRoute.use(express.json())
const saltRounds = 6;
const normalKey = process.env.normalTokenKey;
const refreshKey = process.env.RefreshTokenKey;




// Signup Route
userRoute.post("/signup", checkUsernameAndemail, async (req, res) => {
    let { name, username, email, role, password } = req.body;
    if (!name || !username || !email || !role || !password) {
        return res.send({ "message": "Please fill all the details" });
    }
    try {

        bcrypt.hash(password, saltRounds, async (err, hash) => {
            if (hash) {
                let data = new UserModel({ name, username, email, role, "password": hash })
                await data.save();
                res.send({ "message": "Signup Successfull" });
            } else {
                res.send({ "message": "Error while hashing password" });
            }
        });
    } catch (error) {
        res.send({ "message": "Something went wrong", 'error': error });
    }
})



// Login Route
userRoute.post("/login", async (req, res) => {
    let { username, email, password } = req.body;
    try {
        const check = await UserModel.find({ $or: [{ "email": email }, { "username": username }] })
        if (check.length == 1) {
            bcrypt.compare(password, check[0].password, function (err, result) {
                if (result) {
                    let normalToken = jwt.sign({ username: check[0].username, email: check[0].email, role: check[0].role }, normalKey, { expiresIn: '1m' });
                    let refreshToken = jwt.sign({ username: check[0].username, email: check[0].email, role: check[0].role }, refreshKey, { expiresIn: '5m' });
                    res.send([{ "message": "Login Successfull" }, { "Access_Token": normalToken, "Refresh_Token": refreshToken }]);
                } else {
                    res.send({ "message": "Wrong Credentials" });
                }
            });
        } else {
            res.send({ "message": "Wrong Credentials" });
        }
    } catch (error) {
        res.send({ "message": "Something went wrong", 'error': error });
    }
})




// Refresh Token is provided here
userRoute.get("/getToken", async (req, res) => {
    let token = req.headers.authorization;
    try {

        jwt.verify(token, refreshKey, async (err, decoded) => {
            if (decoded) {
                const check = await UserModel.find({ "email": decoded.email })
                if (check.length == 1) {
                    if (check[0].username == decoded.username) {
                        let normalToken = jwt.sign({ username: check[0].username, email: check[0].email, role: check[0].role }, normalKey, { expiresIn: '1m' });
                        res.send([{"message": "You Got New Token"},{ "Access_Token": normalToken }]);
                    }
                } else {
                    res.send({ "message": "Wrong Credentials" });
                }
            } else {
                res.send({ "message": "Wrong Credentials" });
            }
        });

    } catch (error) {
        res.send({ "message": "Something went wrong", 'error': error });
    }
})





// Logout
userRoute.post("/logout", async (req, res) => {
    let { authorization } = req.headers;
    try {
        let add = new BlacklistModel({ "token": authorization });
        await add.save();
        res.send({ "message": "Logout Successfull" });
    } catch (error) {
        res.send({ "message": "Something went wrong", 'error': error });
    }
});








module.exports = { userRoute };