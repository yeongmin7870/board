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
    setBoard: function(board) {
        let {board_id, user_id, board_title, book_classification_id, board_contents, board_image, board_comment} = board;
        values=[
            [board_id, user_id, board_title, book_classification_id,board_contents, board_image, board_comment]
        ];
        return new Promise((resolve, reject) => {
            con.getConnection((err, con) => {
                if(err){
                    console.log(err);
                }
                con.query(
                    'INSERT INTO board VALUES ?', [values],(err, result,fields) => {
                        if(err)
                            reject(err);
                        else
                            resolve(result);
                    }
                );
                con.release();
            });
        })
    }
}