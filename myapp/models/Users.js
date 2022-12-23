const mysql = require('mysql2');
const db = require('../config/mysqlconn.js');
const con = mysql.createConnection(db);


module.exports = {
    getUsers: function () {
        con.connect();
        return new Promise((resolve, reject) => {
            con.query(
                'SELECT * FROM user', (err, result, fields) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(result);
                    }
                }
            )
        });
        con.end();
    },

    doSignIn: function(id, passwd){
       let values=[
            [id, passwd]
        ];
        con.connect();
        return new Promise((resolve, reject) => {
            con.query(
               'SELECT * FROM user WHERE user_id=? and user_passwd=?',values, (err, result, fields) =>
               {
                   if(err) reject(err);
                   else resolve(result);
               }
           )
        });
        con.end();
    },

};