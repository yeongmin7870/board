const con = require('../config/mysqlconn.js');
const mysql = require('mysql2');

module.exports = {
    /** 아이디를 입력받으면
     *  채팅방에대한 정보
     *  리턴
     */
    checkedRoom: (user_id) => {
        const sql = "SELECT * FROM chat_room WHERE "+
        "user_id=?";
        return new Promise((resovle, reject) => {
            con.getConnection((err, con) => {
                if (err) throw (err);
                con.query(sql, (err, result) => {
                    if (err) reject(err);
                    else resovle(result);
                })
            });
            con.release();
        });
    },
}