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
router.get('/profile-popup', (req, res) => {
    res.render('profile_popup');
})
// 게시판상태 수정 화면
router.get('/boardstate-popup', (req, res) => {
    res.render('board_state_popup');
})
// 소개글 수정 화면
router.get('/introduce-popup', (req, res) => {
    res.render('introduce_popup');
})
// 게시판 수정 페이지
router.get('/chageboard', boardcontroller.dochangeboard)
// 메인 채팅 페이지
router.get('/chatting', (req, res) => {
    res.render('chatting', { room_name: req.body.room_name, Nickname: req.query.Nickname });
})
// 나의 채팅 리스트 페이지
router.get('/chatting_list', (req, res) => {
    res.render('chatting_list');
})
// 대학및 전공선택 페이지
router.get('/university', (req, res) => {
    res.render('university')
});
module.exports = router;