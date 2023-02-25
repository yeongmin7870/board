const express = require('express');
const router = express.Router();
const authUtil = require('../middlewares/auth').checkToken;
/**게시판 Controller */
const boardcontroller = require('../controller/BoardController');
/**파일 업로드 하기 위한 Multer 라이브러리*/
const multer = require('../middlewares/multer').upload;
const upload = multer.single("profile");

// 게시판 작성하기
router.post('/board', (req, res) => {
    upload(req, res, (err) => {
        if (err) {
            if (err.message == "File too large") return res.send(`<script>alert("이미지는 3MB 이하로만 올릴 수 있습니다."); </script>`);
            if (err.message == "not image extension") return res.send(`<script>alert("이미지 파일이 아닙니다."); </script>`);
            return res.send(err);
        } else boardcontroller.doWriteBoard(req, res);
    })
})  // 게시판 수정
    .put('/board', (req, res) => {
        upload(req, res, (err) => {
            if (err) {
                if (err.message == "File too large") return res.send(`<script>alert("이미지는 3MB 이하로만 올릴 수 있습니다."); </script>`);
                if (err.message == "not image extension") return res.send(`<script>alert("이미지 파일이 아닙니다."); </script>`);
                return res.send(err);
            } else boardcontroller.updateBoard(req, res);
        })
    })
// 게시판 삭제하기
router.delete('/board/dormboard/:board_id', authUtil, boardcontroller.doRmByBoard)
// 메인홈페이지 게시판 보여줄 정보만 가져오기
router.get('/board/main-contents', boardcontroller.getAllBoard)
// 해당 마이페이지 주인 정보 가져오기
router.get('/board-mypage/:nickname', boardcontroller.FindByAllBoard)
// 해당 마이페이지 작성한 게시물 가져오기 
router.get('/board-mypage-content/:nickname', boardcontroller.FindByBoardContent)
// 책 분류표 내용 가져오기 
router.get('/book-class', boardcontroller.findBybookClassification)
// 한 개의 게시판 보기
router.get('/board/page/:board_id', boardcontroller.FindByBoard);
// 게시물 상태 변경
router.put('/boardstate/:board_id', boardcontroller.changeBoardState)

router.post('/board/comment', authUtil, boardcontroller.setToBoardComment)         // 댓글 작성
    .get('/board/comment/:board_id/:page', boardcontroller.getAllComment)          // 해당 게시물 댓글 출력
    .delete('/board/comment/:comment_id', boardcontroller.removeComment)         // 댓글 삭제

module.exports = router;