const express = require('express');
const router = express.Router();
const authUtil = require('../middlewares/auth').checkToken;
const boardcontroller = require('../controller/BoardController');
/*
    단순히 페이지를 연결 시켜주는 uri
*/
// 로그인 페이지
router.get('/login', (req, res) => {
    res.render('index');
});
// 회원 가입 페이지
router.get('/register', (req, res) => {
    res.render('register');
});
// 메인 페이지
router.get('/home/:page', boardcontroller.getAllBoard);
// 게시판 글 작성 페이지
router.get('/write', authUtil, boardcontroller.findBybookClassification);
// 프로파일 업로드 화면
router.get('/profile-popup', (req,res) =>{
    res.render('profile_popup');
})
// 게시판상태 수정 화면
router.get('/boardstate-popup', (req,res) =>{
    res.render('board_state_popup');
})
module.exports = router;