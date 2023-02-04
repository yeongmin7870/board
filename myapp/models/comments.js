const con = require('../config/mysqlconn.js');
const mysql = require('mysql2');

module.exports = {
    setToBoardComment: function (comment) {
        return new Promise((resovle, reject) => {

            con.getConnection((err, con) => {

                if (err) new Error(err);
                else {
                    var today = new Date();
                    values = [
                        [comment.comment_id, comment.user_id, comment.comment_content, today, comment.board_id]
                    ]
                    let sql = "INSERT INTO comment VALUES (?)";
                    con.query(
                        sql, values, (err, result) => {
                            if (err) reject({ msg: 'Bad' });
                            else resovle({ msg: 'Finsh' });
                        }
                    );

                }
                con.release();
            });

        });
    },
    getByboardComment: (board_id, columnSize, startColumn) => {
        let needsinfo = "c.comment_id, c.comment_content, c.comment_time, c.board_id, u.nickname";
        return new Promise((resovle, reject) => {
            con.getConnection((err, con) => {
                if (err) console.log(new Error(err));
                else {
                    let sql = `SELECT ${needsinfo} FROM comment c, user u WHERE c.board_id=? AND u.user_id = c.user_id ORDER BY c.comment_id DESC`
                        + " LIMIT ?  OFFSET ?";
                    con.query(
                        sql, [board_id, columnSize, startColumn], (err, result) => {
                            if (err) {
                                reject(err);
                                throw err;
                            }
                            else resovle(result);
                        }
                    );
                }
                con.release();
            });
        });
    },
    removeComment: (comment_id) => {
        return new Promise((resovle, reject) => {
            con.getConnection((err, con) => {
                if (err) console.log(err);
                else {
                    let sql = "DELETE FROM comment WHERE comment_id=?";
                    con.query(
                        sql, [comment_id], (err, result) => {
                            if (err) {
                                reject(err);
                                throw err;
                            }
                            else resovle(result);
                        }
                    );
                }
                con.release();
            });
        });
    },
    getOneComment: (comment_id) => {
        return new Promise((resovle, reject) => {
            con.getConnection((err, con) => {
                if (err) console.log(err);
                else {
                    let sql = "SELECT * FROM comment WHERE comment_id=?";
                    con.query(
                        sql, [comment_id], (err, result) => {
                            if (err) {
                                reject(err);
                                throw err;
                            }
                            else resovle(result);
                        }
                    );
                }
                con.release();
            });
        });
    },
    /** 해당 게시물 아이디를 입력받으면
     *  게시물 댓글 총 개수 출력 
     */
    getCountComment: (board_id) => {
        return new Promise((resovle, reject) => {
            con.getConnection((err, con) => {
                if (err) console.log(err);
                else {
                    let sql = "SELECT COUNT(*) as cnt FROM comment WHERE board_id=?";
                    con.query(
                        sql, [board_id], (err, result) => {
                            if (err) {
                                reject(err);
                                throw err;
                            }
                            else resovle(result[0].cnt);
                        }
                    );
                }
                con.release();
            });
        });
    },
};