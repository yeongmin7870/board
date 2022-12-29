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
}