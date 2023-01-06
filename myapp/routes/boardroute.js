const express = require('express');
const router = express.Router();
const authUtil = require('../middlewares/auth').checkToken;
const boardcontroller = require('../controller/BoardController');
const {upload} = require('../middlewares/multer');
/*
    게시판 관련 uri
*/
// 게시판 작성하기
router.post('/board', [authUtil,upload.single("board_image")],boardcontroller.doWriteBoard)
// 게시판 삭제하기
router.delete('/board/dormboard/:board_id', authUtil, boardcontroller.doRmByBoard)
// 메인홈페이지 게시판 보여줄 정보만 가져오기
router.get('/board/main-contents', boardcontroller.getAllBoard)
// 해당 아이디가 작성한 게시판 정보 가져오기
router.get('/board-mypage', authUtil, boardcontroller.FindByAllBoard)
// 책 분류표 내용 가져오기 
router.get('/book-class', boardcontroller.findBybookClassification)

// 댓글 작성
router.post('/board/comment',boardcontroller.setToBoardComment)
// 해당 게시물 댓글 출력
router.get('/board/comment', boardcontroller.getByboardComment)
module.exports = router;