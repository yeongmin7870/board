const express = require('express');
const Book = require('../models/books');
module.exports = {

    // 게시판 글 작성
    doWriteBoard: function (req, res) {

        return res.send(req.body);
    },

    findBybookClassification: function (req, res) {  
        Book.getBookClassifications().then((result) => {
            res.send(result);
        });
    },
}