const Registration = require("../controllers/AuthController/AuthController").registration;
const Login = require("../controllers/AuthController/AuthController").login;
const User = require("../models/User");
const JestMock = require("jest-mock-req-res");
const helpers = require("../helpers/Helpers");
const jwt = require('jsonwebtoken');

jest.mock('../models/User');
jest.mock("../helpers/Helpers");
jest.mock('jsonwebtoken');

const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn().mockReturnThis()
}

describe('Тестирование метода registration из authController', () => {
    it(`Должен возвращать объект с информацией о пользователе, его токен и сообщение о завершении при корректно переданных данных 
        и при отстутствии данного пользователя в базе данных`, 
        async () => {
        const req = JestMock.mockRequest({body: {
                email: 'new__user__email', 
                password: 'new__user__password',
                name: 'new__user__name',
            },
        });

        User.find.mockResolvedValueOnce([]);
        helpers.generateAccessToken.mockReturnValue('token');
        await Registration(req, res);

        expect(helpers.generateAccessToken).toHaveBeenCalledTimes(1);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(User).toHaveBeenCalledTimes(1);

        expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
            user: expect.anything(),
            message: "Регистрация прошла успешно",
            token: "token"
        }));
    });
    it(`Должен возвращать 400 статус код и сообщение о завершении если пользователь уже существует`, 
        async () => {
        const req = JestMock.mockRequest({body: {
                email: 'existed__user__email', 
                password: 'existed__user__password',
                name: 'existed__user__name',
            },
        });

        User.find.mockResolvedValueOnce([{_id: "finded__id"}]);
        await Registration(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
            message: "Данный пользователь уже существует",
        }));
    });
});

describe('Тестирование метода login из authController', () => {
    it(`Должен возвращать 400 статус код и сообщение о том, что пользователь не найден если пользователя не существует`, 
        async () => {
        const req = JestMock.mockRequest({body: {
                email: 'notExisted__user__email', 
                password: 'notExisted__user__password',
            },
        });

        User.findOne.mockResolvedValueOnce(null);
        await Login(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
            message: `Пользователь ${req.body.email} не найден`,
        }));

    });
    it(`Должен возвращать 400 статус код и сообщение о том, что пароль неправильный, если пользователь существует, но пароль
        введен неверно`, 
        async () => {
        const req = JestMock.mockRequest({body: {
                email: 'existed__user__email', 
                password: 'wrong__user__password',
            },
        });

        User.findOne.mockResolvedValueOnce({email: req.body.email, password: expect.not.stringMatching(req.body.password)});
        await Login(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
            message: `Неправильный пароль!`,
        }));

    });
    it(`Должен возвращать 200 статус код, объект юзера и сообщение о завершении в случае если данные введены верно`, 
        async () => {
        const req = JestMock.mockRequest({body: {
                email: 'existed__user__email', 
                password: 'existed__user__password',
            },
        });

        User.findOne.mockResolvedValueOnce({email: req.body.email, password: req.body.password});
        helpers.generateAccessToken.mockReturnValue("token");
        await Login(req, res);

        expect(helpers.generateAccessToken).toHaveBeenCalledTimes(2);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
            message: `Успешный вход`,
            token: "token",
            user: expect.anything(),
        }));

    });
});