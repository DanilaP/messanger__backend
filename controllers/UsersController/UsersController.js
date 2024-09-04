const User = require("../../models/User");
const helpers = require('../../helpers/Helpers');

class UsersController {
    
    async myData(req, res) {
        try {
            const user = await helpers.getUserFromToken(req);

            if (user) {
                return res.status(200).json({message: "Данные успешно получены", user: user});
            }
            else {
                return res.status(400).json("Ошибка получения данных!");
            }
        }
        catch (error) {
            console.log(error);
            return res.status(500).json("Ошибка получения данных о пользователе!");
        }
    }

    async myFriendsData(req, res) {
        try {
            const user = await helpers.getUserFromToken(req);
            const friendsInfo = await User.find({ _id: { $in: user.friends } }).select("_id name avatar");
            res.status(200).json({message: "Успешное получение данных о друзьях", friends: friendsInfo});
        } 
        catch (error) {
            console.log(error);
            return res.status(400).json("Ошибка получения данных о друзьях!");
        }   
    }

    async guestFriendsData(req, res) {
        try {
            const friendsInfo = await User.find({ _id: { $in: req.body.friends } }).select("_id name avatar");
            res.status(200).json({message: "Успешное получение данных о друзьях", friends: friendsInfo});
        } 
        catch (error) {
            console.log(error);
            return res.status(400).json("Ошибка получения данных о друзьях!");
        }   
    }

    async getDataById(req, res) {
        try {
            const userInfo = await User.findOne({ _id: req.body.userId });
            res.status(200).json({message: "Успешное получение данных о пользователе!", userInfo: {
                name: userInfo.name,
                friends: userInfo.friends,
                avatar: userInfo.avatar,
                posts: userInfo.posts
            }});
        }
        catch (error) {
            console.log(error);
            return res.status(500).json("Ошибка получения данных о пользователе!");
        }
    }

    async getAllUsersData(req, res) {
        try {
            const user = await helpers.getUserFromToken(req);
            const allUsersInfo = await User.find({_id: {$ne: user._id}}, {name: true, _id: true, avatar: true});
            res.status(200).json({message: "Успешное получение данных о пользователях", users: allUsersInfo});
        } 
        catch (error) {
            console.log(error);
            return res.status(400).json("Ошибка получения данных о всех пользователях!");
        }   
    }

    async changeAvatar(req, res) {
        try {
            if (req.files && Object.keys(req.files).length !== 0) {

                let user = await helpers.getUserFromToken(req);
                
                const uploadedFile = req.files.userAvatar;
                const uploadPath = "C:/Users/Данила/messanger__backend/staticFiles/UserAvatars/" + user.email + "_" + uploadedFile.name;
                await User.updateOne({ _id: user._id }, { $set: { avatar: "http://localhost:5000/UserAvatars/" + user.email + "_" + uploadedFile.name } });
            
                uploadedFile.mv(uploadPath, function (err) {
                    if (err) {
                        console.log(err);
                        res.send("Ошибка загрузки файла!");
                    } 
                    else res.json({message: "Файл успешно загружен!", avatar: "http://localhost:5000/UserAvatars/" + user.email + "_" + uploadedFile.name});
                });
            } 
            else res.send("Файл аватара отсутствует!");
        } 
        catch (error) {
            console.log(error);
            return res.status(400).json("Ошибка загрузки нового аватара!");
        }   
    }
    
    async sendFriendRequest(req, res) {
        try {
            let user = await helpers.getUserFromToken(req);
            let newFriend = await User.findOne({_id: req.body.newFriendId});

            let isRequestExists = newFriend.friendRequests.filter((request) => 
                JSON.stringify(request.id) === JSON.stringify(user.id));
            let isAlreadyFriend = user.friends.filter((friendID) => JSON.stringify(friendID) === JSON.stringify(newFriend._id));

            if (isAlreadyFriend.length > 0) {
                res.status(200).json("Данный пользователь уже у вас в друзьях!");
            }
            else if (JSON.stringify(newFriend.id) === JSON.stringify(user.id)) {
                res.status(200).json("Вы не можете отправить заявку себе самому!");
            }
            else if (isRequestExists.length > 0) {
                res.status(200).json("Вы уже отправляли заявку в друзья данному пользователю!");
            }
            else {
                await User.updateOne({ _id: newFriend._id }, { $set: { friendRequests: [...newFriend.friendRequests, { 
                    id: user._id, name: user.name, status: "В ожидании ответа", avatar: user.avatar  }] 
                } });
                res.status(200).json("Заявка в друзья отправлена");
            }
        } 
        catch (error) {
            console.log(error);
            return res.status(400).json("Ошибка при добавлении в друзья!");
        }   
    }

    async acceptFriendRequest(req, res) {
        try {
            let user = await helpers.getUserFromToken(req);
            let friendRequestId = req.body.friendRequestId;
            let friendObject = await User.findOne({_id: req.body.friendRequestId});

            let newFriendRequestsArray = user.friendRequests.filter((request) => 
                JSON.stringify(request.id) !== JSON.stringify(friendRequestId));

            await User.updateOne({ _id: user._id }, { $set: { friends: [...user.friends, friendRequestId ], 
                friendRequests: newFriendRequestsArray
            } });
            await User.updateOne({ _id: friendObject._id }, { $set: { friends: [...friendObject.friends, user._id ]} });
            return res.status(200).json({message: "Заявка в друзья принята", friendRequests: newFriendRequestsArray});
        } 
        catch (error) {
            console.log(error);
            return res.status(400).json("Ошибка при принятии заявки в друзья!");
        }   
    }

    async declineFriendRequest(req, res) {
        try {
            let user = await helpers.getUserFromToken(req);
            let friendRequestId = req.body.friendRequestId;

            let newFriendRequestsArray = user.friendRequests.filter((request) => 
                JSON.stringify(request.id) !== JSON.stringify(friendRequestId));

            await User.updateOne({ _id: user._id }, { $set: { friendRequests: newFriendRequestsArray } });
            return res.status(200).json({message: "Заявка в друзья отклонена", friendRequests: newFriendRequestsArray});
        } 
        catch (error) {
            console.log(error);
            return res.status(400).json("Ошибка при отклонении заявки в друзья!");
        }   
    }

    async deleteFriend(req, res) {
        try {
            let user = await helpers.getUserFromToken(req);
            let deletedFriendId = req.body.deletedFriendId;
            let deletedFriend = await User.findOne({_id: deletedFriendId});

            let newDeletedFriendArray = deletedFriend.friends.filter((friendId) => 
                JSON.stringify(friendId) !== JSON.stringify(user._id));
            let newFriendsArray = user.friends.filter((friendId) => 
                JSON.stringify(friendId) !== JSON.stringify(deletedFriendId));

            await User.bulkWrite([
                { 
                  updateOne: {
                    filter: { _id: user._id },
                    update: { $set: { friends: newFriendsArray } }
                  }
                },
                { 
                  updateOne: {
                    filter: { _id: deletedFriendId },
                    update: { $set: { friends: newDeletedFriendArray } }
                  }
                }
            ]);
            
            const friendsInfo = await User.find({ _id: { $in: newFriendsArray } });
            return res.status(200).json({message: "Друг удалён", friends: friendsInfo});
        } 
        catch (error) {
            console.log(error);
            return res.status(400).json("Ошибка при удалении друга!");
        }   
    }
}

module.exports = new UsersController()


