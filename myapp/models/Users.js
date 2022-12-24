const mysql = require('mysql2');
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

    doSignIn: function(user_id){
       let values=[
            [user_id]
        ];

        console.log(user_id);
        return new Promise((resolve, reject) => {
            con.getConnection((err,con) =>{
                if(err){
                    console.log(err);
                }
                con.query(
                    "SELECT * FROM user WHERE user_id = ?",values,function(err, result, fields){
                        if(err){
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

};