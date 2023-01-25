const express = require('express');
const router = express.Router();
const authUtil = require('../middlewares/auth').checkToken;
/**게시판 Controller */
const boardcontroller = require('../controller/BoardController');
/**파일 업로드 하기 위한 Multer 라이브러리*/
const { upload } = require('../middlewares/multer');

// 게시판 작성하기
router.post('/board', [upload.single("board_image")], boardcontroller.doWriteBoard)
// 게시판 삭제하기
router.delete('/board/dormboard/:board_id', authUtil, boardcontroller.doRmByBoard)
// 메인홈페이지 게시판 보여줄 정보만 가져오기
router.get('/board/main-contents', boardcontroller.getAllBoard)
// 해당 아이디가 작성한 게시판 정보 가져오기
router.get('/board-mypage', authUtil, boardcontroller.FindByAllBoard)
// 책 분류표 내용 가져오기 
router.get('/book-class', boardcontroller.findBybookClassification)
// 한 개의 게시판 보기
router.get('/board/page/:board_id', boardcontroller.FindByBoard);

router.post('/board/comment', authUtil, boardcontroller.setToBoardComment)         // 댓글 작성
    .get('/board/comment/:board_id/:page',boardcontroller.getAllComment)          // 해당 게시물 댓글 출력
    .delete('/board/comment/:comment_id', boardcontroller.removeComment)         // 댓글 삭제

module.exports = router;