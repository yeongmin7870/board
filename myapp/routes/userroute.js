const express = require('express');
const router = express.Router();
const UserController = require('../controller/UserController');
const authUtil = require('../middlewares/auth').checkToken;
/**파일 업로드 하기 위한 Multer 라이브러리*/
const multer = require('../middlewares/multer').upload;
const upload = multer.single("profile");
/*
    고객 관련 uri
*/
// 회원정보 가져오기
router.get('/users', UserController.doGetUser);
// 로그인
router.post('/user/sign-in', UserController.doSignIn)
// 회원가입
router.post('/user/sign-up', UserController.doSignUp)
// 이메일 인증
router.post('/mail', UserController.doAuthMail)
// 닉네임 체크
router.get('/checknickname/:data', UserController.findNickname)
// 토큰 유효성 체크
router.post('/verify', UserController.verifyToken);
// 닉네임만 가져오기
router.get('/getnickname', UserController.getNickname);
// 유저 프로파일 등록
router.put('/upload-profile', (req, res) => {
    upload(req, res, (err) => {
        if (err) {
            if (err.message == "File too large") return res.send(`<script>alert("이미지는 3MB 이하로만 올릴 수 있습니다."); window.close();</script>`);
            if (err.message == "not image extension") return res.send(`<script>alert("이미지 파일이 아닙니다."); window.close();</script>`);
        } else UserController.uploadProfile(req, res);
    })
})
// 유저 자기소개 등록
router.put('/upload-indroduce', UserController.uploadIntroduce)

module.exports = router;