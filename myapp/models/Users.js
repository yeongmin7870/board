const con = require('../config/mysqlconn.js');


module.exports = {
    getUsers: function () {
        return new Promise((resolve, reject) => {
            con.getConnection((err, con) => {
                con.query(
                    'SELECT * FROM user', (err, result) => {
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
    doSignIn: function (user_id) {
        let values = [
            [user_id]
        ];
        let sql = "SELECT * FROM user WHERE user_id = ?";

        return new Promise((resolve, reject) => {
            con.getConnection((err, con) => {
                if(err) new Error(err);
                con.query(
                    sql, values, function (err, result) {
                        if (err) reject(err);
                        else resolve(result);
                    }
                )
                con.release();
            });
        });
    },

    doSignUp: function (user) {
        let sql = "INSERT INTO user " +
            "SELECT ? FROM DUAL WHERE " +
            "NOT EXISTS (SELECT user_id FROM user WHERE user_id= ?)";
        let values = [
            [user['user_id'], user['user_passwd'], user['user_salt'], user['user_email'], user['user_profile'], user['user_address'], user['nickname']],
            [user['user_id']]
        ];
        return new Promise((resolve, reject) => {
            con.getConnection((err, con) => {
                con.query(
                    sql, values, function (err, result) {
                        if (err) {
                            reject(err);
                        } else {
                            if (result['affectedRows'] == 0) {
                                result = -1 //존재하는 아이디
                            } else {
                                result = 1 //생성완료
                                console.log('회원가입되었습니다.')
                            }
                            resolve(result);
                        }
                    }
                );
                con.release();
            });
        });
    },
    findNickname: function (nickname) {

        let sql = "SELECT * FROM user WHERE nickname = ?";

        return new Promise((resolve, reject) => {
            con.getConnection((err, con) => {
                con.query(
                    sql, [nickname], function (err, result) {
                        if (err) new Error(err);
                        if (result.length == 0) {
                            resolve({ msg: "ok" })  // 해당 닉네임이 없음
                        } else {
                            reject({ msg: "no" })
                        }
                    }
                )
                con.release();
            });
        });
    },

};