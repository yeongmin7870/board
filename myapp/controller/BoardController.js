const express = require('express');
const Book = require('../models/books');
const jwt = require('../modules/jwt');
module.exports = {

    // 게시판 글 작성
    doWriteBoard: async function (req, res) {
        const reg = new RegExp('\.jpg|\.png|\.jpeg|\.gif$', 'i'); // i: 대소문자 구분하지말고, 이미지 확장자를 찾아라
        if (reg.test(req.body.board_image) == false) {
            res.status(404).send(`<script>
            location.href='/v2/write';
            alert('이미지 파일이 아닙니다 🐱');
            </script>`);
            return;
        }
        const decode = await jwt.verify(req.cookies.x_auth.token); //토큰 해독
        req.body.user_id = decode.user_id; // 토큰 오브젝트에서 고객 아이디만 꺼내기
        Book.setBoard(req.body).then((result) => {
            res.status(200).redirect('/v2/home');
        });
    },
    //메인홈페이지 필요한 게시글 전체 가져오기
    getAllBoard: function (req, res) {
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
    findBybookClassification: function (req, res) {
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
}