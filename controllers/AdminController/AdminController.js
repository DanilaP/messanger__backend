const Boss = require("../../models/Boss");

class AdminController {

    async addBoss(req, res) {
        try {
            const bossInfo = {
                name: "Кирпич",
                hp: 1000,
                rublesRewards: 0,
                regardRewards: 100,
                smokeRewards: 1000,
                mainAvatar: "http://localhost:5000/BossImages/Kirpich/kirpich_main.jpg",
                stages: [{hp:1000,stageAvatar:"http://localhost:5000/BossImages/Kirpich/kirpich_1.jpg"},{hp:500,stageAvatar:"http://localhost:5000/BossImages/Kirpich/kirpich_2.jpg"},{hp:250,stageAvatar:"http://localhost:5000/BossImages/Kirpich/kirpich_3.jpg"}],
            }
            await Boss.create(bossInfo);
            res.status(200).json({bossInfo: bossInfo});
        }
        catch (error) {
            console.log(error);
            res.status(400).json({message: "Ошибка добавления босса"});
        }
    }
}

module.exports = new AdminController()