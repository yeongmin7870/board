const express = require('express');
const router = express.Router();
const UserController = require('../controller/UserController');
const authUtil = require('../middlewares/auth').checkToken;
/*
    고객 관련 uri
*/
// 회원정보 가져오기
router.get('/users', UserController.doGetUser);
// 로그인
router.post('/user/sign-in', UserController.doSignIn)
// 회원가입
router.post('/user/sign-up',UserController.doSignUp)
// 이메일 인증
router.post('/mail', UserController.doAuthMail)
// 이메일 승인코드 확인
router.get('/checkemail/:data', UserController.findCode)
// 닉네임 체크
router.get('/checknickname/:data',UserController.findEmail)
module.exports = router;