const bcrypt = require('bcryptjs')
const User = require("../models/User")
const jwt_decode = require('jwt-decode')


class profileController {
    async changeUserPassword(req, res) {
        try {
            const userPassword = req.body.newPassword;
            const hashPassword = bcrypt.hashSync(userPassword, 7);
            const token = req.headers.authorization;     
            const userId = jwt_decode(token);

            await User.updateOne({ _id: userId.id }, { $set: { userPassword: hashPassword } });
            res.status(200).json({message: "Password changed!"})
        }
        catch (e) {
            console.log(e);
            res.status(400).json({message: "Error!"});
        }
    }
    async changeUserSecretCode(req, res) {
        try {
            const newSecretAccessCode = req.body.newSecretAccessCode;
            const token = req.headers.authorization;     
            const userId = jwt_decode(token);

            await User.updateOne({ _id: userId.id }, { $set: { secretAccessCode: newSecretAccessCode } });
            res.status(200).json({message: "Your secret code changed!"})
        }
        catch (e) {
            console.log(e);
            res.status(400).json({message: "Error!"});
        }
    }
    async getUserDataById(req, res) {
        try {
            const gettingDataId = req.body.id;  

            let foundedUser = await User.findOne({_id: gettingDataId});
            if (req.body.secretAccessCode === foundedUser.secretAccessCode) {
                return res.status(200).json({message: "Sucessfull", userData: {
                    id: foundedUser._id,
                    avatar: foundedUser.avatar,
                    files: foundedUser.files,
                }})
            }
            else res.status(400).json({message: "Access dined! Try again."})
        }
        catch (e) {
            console.log(e);
            res.status(400).json({message: "Error!"});
        }
    }
}
module.exports = new profileController()