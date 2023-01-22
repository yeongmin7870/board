const express = require('express');
const Book = require('../models/books');
const jwt = require('../modules/jwt');
const fs = require('fs');
const Comment = require('../models/comments');

module.exports = {

    // 게시판 글 작성
    doWriteBoard: async function (req, res) {
        try {
            req.body.board_image = req.file.filename; // multer middleware에서 확장자가 이미지가 아니면 파일이 생성되지 않기 때문에 req에 file 존재가 없음 따라서 catch에 걸리게 됨

            const decode = await jwt.verify(req.cookies.x_auth.token); //토큰 해독
            req.body.user_id = decode.user_id; // 토큰 오브젝트에서 고객 아이디만 꺼내기
            Book.setBoard(req.body).then((result) => {
                console.log('글 작성됨');
                res.status(200).redirect('/v2/home/0');
            });
        } catch (e) {
            res.status(404).send(`<script>
            location.href='/v2/write';
            alert('이미지 파일이 아닙니다 🐱');
            </script>`);
        }
    },
    /**
     * 메인홈 게시판 목록 출력
     * @param {*} page 현재 페이지 0부터 시작
     *  
     */
    getAllBoard: async function (req, res) {
        let current_page = req.params.page // 현재 페이지

        let columnSize = 4; // 컬럼 사이즈

        let cnt_column = await Book.getCntFindAll(); // 전체 컬럼 개수
        let total_page = Math.ceil(cnt_column[0].cnt / columnSize); // 전체 페이지 개수

        if (current_page < 0 || current_page >= total_page) current_page = 0; // 만약 현재 페이지 범위가 벗어나면 현재페이지를 0으로 고정

        let startColumn = (current_page * columnSize); //시작하는 컬럼
        const result = await Book.getAllBoard(startColumn, columnSize); // 현재 페이지 컬럼 가져오기 

        let prevPage = true;   // 이전 페이지 유무
        let nexPage = true;    // 다음 페이지 유무 

        let page_size = 4; // 보여질 페이지 수

        let start_page = current_page - Math.ceil(page_size / 2);   // 시작페이지 = 현재페이지 - (올림(보여질 페이지 수 / 2))
        if (start_page <= 0) {      // 시작페이지가 0이거나 작을때
            prevPage = false;
            start_page = 0;
        }

        let end_page = start_page + page_size; // 끝페이지 = 시작페이지 + 보여질 페이지 수
        if (end_page >= total_page) {   // 끝페이지가 전체페이지랑 같거나 클때
            nexPage = false;
            end_page = total_page;
        }
        res.render('home', { board: { result }, page: { prevPage, nexPage, total_page, start_page, end_page, current_page, page_size } });
    },
    // 해당 아이디 게시글 찾기
    FindByAllBoard: async function (req, res) {
        const decode = await jwt.verify(req.cookies.x_auth.token); //토큰 해독
        req.body.user_id = decode.user_id; // 토큰 오브젝트에서 고객 아이디만 꺼내기
        Book.FindByAllBoard(req.body.user_id).then((result) => {
            res.status(200).render('mylist', { myboard: { result } });
        });
    },
    // 책 카테고리 
    findBybookClassification: async function (req, res) {
        Book.getBookClassifications().then((result) => {
            res.status(200).render('writeboard', { book: { result } });
        });
    },
    // 해당 게시글 한 개 찾기
    FindByBoard: async function (req, res) {
        try {
            await Book.view_count(req.params.board_id); // 조회수 +1
            const result = await Book.FindByBoard(req.params.board_id);
            res.status(200).render('board', { myboard: { result } });
        } catch (err) {
            console.log(err);
        }
    },
    // 해당 게시글 삭제
    doRmByBoard: async function (req, res) {
        // 해당 이미지 파일 이름 찾고 삭제하기
        Book.FindByBoard(req.params.board_id).then((result) => {
            const image_name = result[0].board_image;
            if (fs.existsSync('./public/images/board/' + image_name)) {
                try {
                    fs.unlinkSync('./public/images/board/' + image_name);
                    console.log("image delete");
                } catch (e) {
                    console.log(e);
                }
            } else {
                console.log("이미지 파일이 존재하지 않음");
            }
        });
        // 디비 게시글 데이터 삭제 
        Book.doRmByBoard(req.params.board_id).then((result) => {
            res.status(201).redirect('/v2/home/0');
        });
    },
    // 댓글 작성
    setToBoardComment: async function (req, res) {
        Comment.setToBoardComment(req.body).then((result) => {
            console.log(`Writing comment is finished`);
            res.send(result);
        })
            .catch((err) => {
                console.log('Writing comment is failled');
                res.send(err);
            })
    },
    //해당 게시글 댓글 보여주기
    getByboardComment: async (req, res) => {
        try {
            let result = await Comment.getByboardComment(req.params.board_id);
            res.send({msg:result});
        } catch (err) {
            res.send({msg:err});
        }
    },
    // 해당 게시물 댓글 삭제
    removeComment: async (req, res) => {
        try {
            let result = await Comment.removeComment(req.params.comment_id);
            console.log('댓글이 삭제되었습니다.');
            res.send('댓글이 삭제되었습니다.');
        } catch (err) {
            res.send(err);
        }
    },
}