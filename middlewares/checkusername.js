const { UserModel } = require("../models/usersModel");


const checkUsernameAndemail = async (req, res, next) => {
    let { username, email } = req.body;
    try {
        const check = await UserModel.find({ "username": username });
        if (check.length == 0) {
            const emailcheck = await UserModel.find({ "email": email });
            if (emailcheck.length == 0) {
                next()
            } else {
                res.send({ "message": "Email is already registered" });
            }
        } else {
            res.send({ 'message': "Username is already registered please provide different" });
        }
    } catch (error) {

    }
}


module.exports = { checkUsernameAndemail };