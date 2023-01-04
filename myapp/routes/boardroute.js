const express = require('express');
const router = express.Router();
const authUtil = require('../middlewares/auth').checkToken;
const boardcontroller = require('../controller/BoardController');
/*
    게시판 관련 uri
*/
// 게시판 작성하기
router.post('/board',authUtil,boardcontroller.doWriteBoard)
// 메인홈페이지 게시판 보여줄 정보만 가져오기
router.get('/board/main-contents',boardcontroller.getAllBoard)
// 해당 아이디가 작성한 게시판 정보 가져오기
router.get('/board-mypage',authUtil,boardcontroller.FindByAllBoard)
// 책 분류표 내용 가져오기 
router.get('/book-class',boardcontroller.findBybookClassification)

module.exports=router;