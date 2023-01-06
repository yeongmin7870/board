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
        Book.getAllBoard().then((result) => {
            res.status(200).render('home', { board: { result } });
        });
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
        Book.FindByBoard(req.params.board_id).then((result) => {
            res.status(200).render('board', { myboard: { result } });
        });
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
            console.log('Writing comment is finished');
            res.send(result);
        })
        .catch((err)=>{
            console.log('Writing comment is failled');
            res.send(new Error(err));
        })
    },
    // 해당 게시글 댓글 보여주기
    getByboardComment: async (req,res) => {
        result = await Comment.
    },
    

}