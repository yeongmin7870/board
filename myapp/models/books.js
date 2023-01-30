const con = require('../config/mysqlconn.js');
const mysql = require('mysql2');
module.exports = {
    // 책 종류 가져오기
    getBookClassifications: function () {
        return new Promise((resolve, reject) => {
            con.getConnection((err, con) => {
                if (err) {
                    console.log(err);
                }
                con.query(
                    'SELECT * FROM book_classification', (err, result) => {
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
        let { board_id, user_id, board_title, book_classification_id, board_contents, board_image, price } = board;
        values = [
            [board_id, user_id, board_title, book_classification_id, board_contents, board_image, price, 0]
        ];
        // 토큰 해독

        return new Promise((resolve, reject) => {
            con.getConnection((err, con) => {
                if (err) {
                    console.log(err);
                }
                con.query(
                    'INSERT INTO board VALUES ?', [values], (err, result) => {
                        if (err)
                            reject(err);
                        else
                            resolve(result.insertId);
                    }
                );
                con.release();
            });
        })
    },
    //전체 게시물 카운트 수
    getCntFindAll: function (startPage, endPage) {
        return new Promise((resolve, reject) => {
            con.getConnection((err, con) => {
                if (err) {
                    console.log(err);
                }
                con.query(
                    'SELECT COUNT(*) as cnt FROM board', (err, result) => {
                        if (err)
                            reject(err);
                        else
                            resolve(result[0].cnt);
                    }
                );
                con.release();
            });
        })
    },
    //게시글 내용 전체 가져오기
    getAllBoard: function (startColumn, columnSize) {
        return new Promise((resolve, reject) => {
            con.getConnection((err, con) => {
                if (err) {
                    console.log(err);
                }
                con.query(
                    'SELECT * FROM board b, user u, book_classification bc' +
                    ' WHERE b.user_id = u.user_id AND b.book_classification_id = bc.book_classification_id' +
                    ' ORDER BY board_id DESC LIMIT ?  OFFSET ?;', [columnSize, startColumn], (err, result) => {
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
    FindByAllBoard: function (nickname) {
        return new Promise((resolve, reject) => {
            con.getConnection((err, con) => {
                if (err) {
                    console.log(err);
                }
                con.query(
                    'select * from board b, book_classification bc,user u where ' +
                    'u.nickname=? and b.book_classification_id = bc.book_classification_id and '+
                    'b.user_id = u.user_id', [nickname], (err, result, fields) => {
                        if (err){
                            reject(err);
                        }
                        else {
                            resolve(result);
                        }
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
                    new Error(err);
                    return;
                }
                con.query(
                    'SELECT * FROM board b, book_classification bc, user u' +
                    ' WHERE b.board_id =? AND b.book_classification_id = bc.book_classification_id AND'+
                    ' b.user_id = u.user_id'
                    , [board_id], (err, result) => {
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
    view_count: (board_id) => {
        return new Promise((resovle, reject) => {
            con.getConnection((err, con) => {
                if (err) {
                    new Error(err);
                    return;
                }
                else {
                    con.query(
                        "UPDATE board a, (SELECT view_count+1 as 'view_count' FROM board WHERE board_id=?) b SET " +
                        "a.view_count=b.view_count WHERE board_id=?", [board_id, board_id], (err, result) => {
                            if (err) reject(err);
                            else resovle(result);
                        }
                    );
                }
                con.release();
            });
        });
    },
    doRmByBoard: function (board_id) {
        let sql1 = "DELETE FROM board b WHERE b.board_id = ?;";
        let sql2 = "DELETE FROM comment c WHERE c.board_id = ?; ";

        let sql_board = mysql.format(sql1, board_id);
        let sql_comment = mysql.format(sql2, board_id);
        
        return new Promise((resolve, reject) => {
            con.getConnection((err, con) => {
                if (err) {
                    console.log(err);
                }
                con.query(
                      sql_comment+sql_board , (err, result) => {
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