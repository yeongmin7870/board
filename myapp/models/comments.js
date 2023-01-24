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
                            if (err) reject({msg:'Bad'});
                            else resovle({msg:'Finsh'});
                        }
                    );

                }
                con.release();
            });

        });
    },
    getByboardComment: (board_id) => {
        return new Promise((resovle, reject) => {
            con.getConnection((err, con) => {
                if (err) console.log(new Error(err));
                else {
                    let sql = "SELECT * FROM comment WHERE board_id=? ORDER BY comment_id DESC";
                    con.query(
                        sql, board_id, (err, result) => {
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
    getOneComment:(comment_id) => {
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
};