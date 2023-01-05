const mysql = require('mysql2');
const db = require('../config/mysqlconn.js');
const con = mysql.createPool(db);

module.exports = {
    // 책 종류 가져오기
    getBookClassifications: function () {
        return new Promise((resolve, reject) => {
            con.getConnection((err, con) => {
                if (err) {
                    console.log(err);
                }
                con.query(
                    'SELECT * FROM book_classification', (err, result, fields) => {
                        if (err)
                            reject(result);
                        else
                            resolve(result);
                    }
                );
                con.release();
            });
        });
    },
    //게시글 작성
    setBoard: function (board) {
        let { board_id, user_id, board_title, book_classification_id, board_contents, board_image, board_comment, price } = board;
        values = [
            [board_id, user_id, board_title, book_classification_id, board_contents, board_image, board_comment, price]
        ];
        // 토큰 해독

        return new Promise((resolve, reject) => {
            con.getConnection((err, con) => {
                if (err) {
                    console.log(err);
                }
                con.query(
                    'INSERT INTO board VALUES ?', [values], (err, result, fields) => {
                        if (err)
                            reject(err);
                        else
                            resolve(result);
                    }
                );
                con.release();
            });
        })
    },
    //게시글 내용 전체 가져오기
    getAllBoard: function () {
        return new Promise((resolve, reject) => {
            con.getConnection((err, con) => {
                if (err) {
                    console.log(err);
                }
                con.query(
                    'SELECT * FROM board', (err, result, fields) => {
                        if (err)
                            reject(err);
                        else
                            resolve(result);
                    }
                );
                con.release();
            });
        })
    },
    // 해당 아이디 게시글 찾기
    FindByAllBoard: function (user_id) {
        return new Promise((resolve, reject) => {
            con.getConnection((err, con) => {
                if (err) {
                    console.log(err);
                }
                con.query(
                    'select * from board b, book_classification bc where ' +
                    'user_id=? and b.book_classification_id = bc.book_classification_id;', [user_id], (err, result, fields) => {
                        if (err)
                            reject(err);
                        else
                            resolve(result);
                    }
                );
                con.release();
            });
        })
    },
    FindByBoard: function (board_id) {
        return new Promise((resolve, reject) => {
            con.getConnection((err, con) => {
                if (err) {
                    console.log(err);
                }
                con.query(
                    'select * from board b,book_classification bc '
                    + 'where b.board_id = ? and b.book_classification_id = bc.book_classification_id', [board_id], (err, result, fields) => {
                        if (err)
                            reject(err);
                        else
                            resolve(result);
                    }
                );
                con.release();
            });
        })
    },
    doRmByBoard: function (board_id) {
        return new Promise((resolve, reject) => {
            con.getConnection((err, con) => {
                if (err) {
                    console.log(err);
                }
                con.query(
                    'DELETE FROM board WHERE board_id = ?', [board_id], (err, result, fields) => {
                        if (err)
                            reject(err);
                        else
                            resolve(result);
                    }
                );
                con.release();
            });
        })
    },
}