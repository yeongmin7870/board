const mysql = require('mysql2');
const { user } = require('../config/mysqlconn.js');
const db = require('../config/mysqlconn.js');
const con = mysql.createPool(db);


module.exports = {
    getUsers: function () {
        return new Promise((resolve, reject) => {
            con.getConnection((err,con)=>{
                if(err){
                    console.log(err);
                }
                    con.query(
                        'SELECT * FROM user', (err, result, fields) => {
                            if (err) {
                                reject(err);
                            } else {
                                resolve(result);
                            }
                        }
                    )
                con.release();
            });
        });
    },
    // 로그인 
    doSignIn: function(user_id, user_passwd){
        let values=[
            [user_id]
        ];
        let sql = "SELECT * FROM user WHERE user_id = ?";

        return new Promise((resolve, reject) => {
            con.getConnection((err,con) =>{
                if(err){
                    console.log(err);
                }
                con.query(
                    sql, values, function(err, result, fields){
                        if(result.length == 0){
                          result = 0  // 해당 회원이 없음
                        } else{
                            if(result[0]['user_passwd'] == user_passwd){
                                result = 1 // 로그인 성공
                            } else {
                                result = -1 // 비밀번호 틀림
                            }            
                        }
                        resolve(result);
                    }
                )
                con.release();
            });
        });
    },

};