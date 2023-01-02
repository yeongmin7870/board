const express = require('express');
const Book = require('../models/books');
module.exports = {

    // 게시판 글 작성
    doWriteBoard: function (req, res) {
        Book.setBoard(req.body).then((result) => {
            console.log(result);
            res.status(201).send(result);
        });
    },
    // 책 카테고리 
    findBybookClassification: function (req, res) {  
        Book.getBookClassifications().then((result) => {
            res.status(200).send(result);
        });
    },
}