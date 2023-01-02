const express = require('express');
const Book = require('../models/books');
module.exports = {

    // 게시판 글 작성
    doWriteBoard: function (req, res) {
        Book.setBoard(req.body).then((result) => {
            console.log(result);
            res.status(200).send(result);
        });
    },
    //게시글 전체 가져오기
    getAllBoard: function (req, res) {
        Book.getAllBoard().then((result) => {
            console.log(result);
            res.status(200).send(result);
        });
    },
    // 게시글 찾기
    FindByBoard: function (req, res) {
        Book.FindByBoard(req.params.board_id).then((result) => {
            console.log(result);
            res.status(200).send(result);
        });
    },
    // 책 카테고리 
    findBybookClassification: function (req, res) {
        Book.getBookClassifications().then((result) => {
            res.status(200).send(result);
        });
    },

}