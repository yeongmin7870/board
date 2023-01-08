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
                res.status(200).redirect('/v2/home');
            });
        } catch (e) {
            res.status(404).send(`<script>
            location.href='/v2/write';
            alert('이미지 파일이 아닙니다 🐱');
            </script>`);
        }
    },
    //메인홈페이지 필요한 게시글 전체 가져오기
    getAllBoard: async function (req, res) {
        const result = await Book.getAllBoard();

        let page_sum = 0; // 페이지 수
        let front_board = 3; // 보여지는 게시글 수
        let current_page = req.params.page; //현재 페이지
        let page = []; // 게시글 내용 바구니

        if (result.length % front_board != 0) {
            page_sum = Math.floor(result.length / 3) + 1; // 페이지 수
            console.log('페이지수' + page_sum);
        }
        for (var i = (current_page - 1) * front_board; i < front_board * current_page; i++) {
            console.log(result[i]);
            if (result[i] === undefined) break;
            page.push(result[i]);
        }

        console.log('page 내용:' + page.length);
        res.status(200).render('home', { board: { page }, page_sum: { page_sum }, current_page: { current_page } });
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
            res.status(201).redirect('/v2/home');
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
            res.send(result);
        } catch (err) {
            res.send(err);
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