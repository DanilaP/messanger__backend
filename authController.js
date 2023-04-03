const User = require("./models/User")
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const jwt_decode = require('jwt-decode')

const generateAccessToken = (id) => {
    const payload = {
        id: id,
    }
    return jwt.sign(payload, "SECRET_KEY_RANDOM", {expiresIn: "24h"});
}
class authController {
    async registration(req, res) {
        try {
            const userLogin = req.body.userLogin;
            const userPassword = req.body.userPassword;
            const balance = 5000;
            const candidate = await User.find({userLogin})

            if (candidate.length !== 0) {
                res.status(400).json({message: "This email is already used"})
            }
            else {
                const hashPassword = bcrypt.hashSync(userPassword, 7);
                const user = new User({
                    userLogin, 
                    userPassword: hashPassword, 
                    balance: balance, 
                    avatar: "http://localhost:5000/" + "avatar.png",
                    secretAccessCode: userPassword,
                });
                const token = generateAccessToken(user._id);
                user.save();
                res.json({message: "Registration successed!", token: token});
            }
            
        }
        catch (e) {
            console.log(e);
            res.status(400).json({message: "Registration error!"});
        }
    }

    async login(req, res) {
        try {
            const {userLogin, userPassword} = req.body;
            const user = await User.findOne({userLogin});

            if(!user) {
                return res.status(400).json({message: `User ${userLogin} not found`});
            }
            const validPassword = bcrypt.compareSync(userPassword, user.userPassword);
            if (!validPassword) {
                return res.status(400).json({message: `Uncorrect password!`});
            }
            else {
                const token = generateAccessToken(user._id);
                return res.json({message: `Login successed`, token: token})
            }
        }
        catch (e) {
            console.log(e);
            res.status(400).json({message: "Login error!"});
        }
    }

    async users(req, res) {
        try {
            res.json('server works!')
        }
        catch (e) {
            console.log(e);
        }
    }

    async getUserData(req, res) {
        const token = req.headers.authorization;     
        const userId = jwt_decode(token);
        let isEmpty = await User.findOne({_id: userId.id});
        if (isEmpty) {
            return res.status(200).json({message: "Sucessfull", userData: {
                //balance: isEmpty.balance,
                login: isEmpty.userLogin,
                id: isEmpty._id,
                avatar: isEmpty.avatar,
                files: isEmpty.files,
                secretAccessCode: isEmpty.secretAccessCode,
                folders: isEmpty.folders,
            }})
        }
        else {
            return res.status(400).json("Geting data error! No such user!")
        }
    }

    async changeUserBalance(req, res) {
        try {
            const token = req.headers.authorization;     
            const userId = jwt_decode(token);
            await User.updateOne({ _id: userId.id }, { $set: { balance: req.body.balance } })
            res.json({message: "Balance updated", newBalance: req.body.balance});
        } catch (e) {
            console.log(e);
            res.status(400).json({message: "Error!"})
        }
    }
}

module.exports = new authController()