const User = require("../models/User");
const jwt_decode = require('jwt-decode');
const fs = require('fs');

class AdminController {
    async getInfoAboutAllUsers (req, res) {
        try {
            const usersInfo = await User.find();
            res.status(200).json({infoAboutAllUsers: usersInfo})
        } 
        catch (err) {
            res.status(400).json({message: "Error of getting info about users!"})
            console.log(err);
        }
    }
    async clearUserStore (req, res) {
        try {
            User.updateOne({ _id: req.body.userId}, { $set: {files: [], folders: []}});
            res.status(200).json({message: "User store was cleared succesfull!"})
        } 
        catch (err) {
            res.status(400).json({message: "Error of changing user data!"})
            console.log(err);
        }
    }
}

module.exports = new AdminController()