const User = require("../../models/User");
const Dialogs = require("../../models/Dialogs");
const jwt = require('jsonwebtoken');
const helpers = require('../../helpers/Helpers');

class MessagesController {
    async createPost (req, res) {
        try {
            let user = await helpers.getUserFromToken(req);
            let uploadedFile = null;
            let uploadPath = "";
            let imageId = Date.now();

            if (req.files && Object.keys(req.files).length !== 0) {
                uploadedFile = req.files.postImage;
                uploadPath = "C:/Users/Данила/messanger__backend/staticFiles/PostsImages/" + user.email + "_" + imageId + "_" + uploadedFile.name;
                uploadedFile.mv(uploadPath, function (err) {
                    if (err) {
                        res.status(400).json({message: "Ошибка при сохранении изображения!"});
                        console.log(err);
                    } 
                });
            }

            const newPost = {
                id: imageId,
                text: req.body.postText,
                image: uploadedFile ? "http://localhost:5000/PostsImages/" + user.email + "_" + imageId + "_" + uploadedFile.name : "",
            }

            await User.updateOne({ _id: user._id }, { $set: { posts: [...user.posts, newPost] }});
            res.status(200).json({message: "Пост успешно создан"});
        }
        catch (error) {
            console.log(error);
            res.status(400).json({message: "Ошибка при создании поста!"})
        }
    }
}

module.exports = new MessagesController()