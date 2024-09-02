const helpers = require("../helpers/Helpers");
const jwt = require('jsonwebtoken');
const User = require("../models/User");
const JestMock = require("jest-mock-req-res");

jest.mock('jsonwebtoken', () => ({
    decode: jest.fn(() => ({ id: 'UserID' })),
}));
jest.mock('../models/User', () => ({
    findOne: jest.fn(),
}));

const userObjectForTesting = {
    _id: 'UserID',
    name: 'UserName',
    email: 'UserEmail',
    password: 'UserPassword',
    friends: [],
    avatar: 'UserAvatarURL',
    friendRequests: [],
}

describe('Тестирование хелпера getUserFromToken', () => {
    it('Должен возвращать объект пользователя при наличии токена в объекте запроса', async () => {
        const req = JestMock.mockRequest({
            headers: {
                authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjEyMyJ9.abc123',
            },
        });
        User.findOne.mockResolvedValueOnce(userObjectForTesting);
        const user = await helpers.getUserFromToken(req);
        expect(user).toEqual(userObjectForTesting);
    });
    it('Должен возвращать сообщение с ошибкой при попытке получить объект пользователя при отстутсвии токена', async () => {
        const req = JestMock.mockRequest({headers: {   }});
        const user = await helpers.getUserFromToken(req);
        expect(user).toEqual("Ошибка при получении объекта пользователя!");
    });
});
