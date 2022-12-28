const express = require('express');
const router = express.Router();
const UserController = require('../controller/UserController');


// 회원정보 가져오기
router.get('/users', UserController.doGetUser);
// 로그인
router.post('/user/sign-in', UserController.doSignIn)
// 회원가입
router.post('/user/sign-up', UserController.doSignUp)

module.exports = router;