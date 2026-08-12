const express = require('express');
const userRouter = express.Router();
const { signupUser, loginUser } = require('../controllers/user.controller');

userRouter.post('/create', signupUser);
userRouter.post('/login', loginUser);

module.exports = userRouter;