const express = require('express');
const router = express.Router();
const authUtil = require('../middlewares/auth').checkToken;
const boardcontroller = require('../controller/BoardController');
/*
    단순히 페이지를 연결 시켜주는 uri
*/
// 로그인 페이지
router.get('/', (req, res) => {
    res.render('index');
});
// 회원 가입 페이지
router.get('/register', (req, res) => {
    res.render('register');
});
// 메인 페이지
router.get('/home', authUtil, boardcontroller.getAllBoard);
// 게시판 글 작성 페이지
router.get('/write', authUtil, boardcontroller.findBybookClassification);
// 마이페이지
router.get('/mypage', authUtil, (req, res) => {
    res.render('mylist');
});
// 게시판 
router.get('/board/page/:board_id', authUtil, boardcontroller.FindByBoard);
module.exports = router;