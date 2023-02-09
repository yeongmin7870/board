const con = require('../config/mysqlconn.js');
const mysql = require('mysql2');

module.exports = {
    getUser: function (user_id) {
        const needInfo = "user_profile, user_address, nickname, user_introduce";
        return new Promise((resolve, reject) => {
            con.getConnection((err, con) => {
                con.query(
                    `SELECT ${needInfo} FROM user WHERE nickname = ?`, [user_id], (err, result) => {
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
    /**로그인
     *  @param user_id 아이디
     *  @return 
     *   해당하는 아이디의 user테이블 정보\
     *   전부 리턴
     */
    doSignIn: function (user_id) {
        let values = [
            [user_id]
        ];
        let sql = "SELECT * FROM user WHERE user_id = ?";

        return new Promise((resolve, reject) => {
            con.getConnection((err, con) => {
                if (err) new Error(err);
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
    /**
     * 회원가입 디비
     * @param {object} user 객체
     * @returns 
     *  result 
     *      -1  존재하는 아이디
     *      1   user 테이블 회원정보 삽입 완료
     */
    doSignUp: function (user) {
        let sql = "INSERT INTO user " +
            "SELECT ? FROM DUAL WHERE " +
            "NOT EXISTS (SELECT user_id FROM user WHERE user_id= ?)";
        let values = [
            [user['user_id'], user['user_passwd'], user['user_salt'], user['user_email'], user['user_profile'], user['user_address'], user['nickname'], user['user_introduce']],
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
    /** 닉네임 찾기
     * 
     * @params nickname 닉네임 객체
     *  @returns 
     *  msg:\
     *      "ok"    해당하는 닉네임을 가진 회원정보 전부 조회 성공\
     *      "no"    해당하는 닉네임을 가진 회원정보 전부 조회 실패
     */
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

    /** 유저 프로파일 등록 */
    uploadProfile: function (user) {
        let sql = "UPDATE user SET user_profile = ? WHERE user_id = ?";

        return new Promise((resolve, reject) => {
            con.getConnection((err, con) => {
                con.query(
                    sql, [user.user_profile, user.user_id], function (err, result) {
                        if (err) new Error(err);
                        if (result) {
                            resolve({ msg: "ok" });
                        } else {
                            console.log(err);
                            reject({ msg: "no" });
                        }
                    }
                )
                con.release();
            });
        });
    },
    /** 아이디를 입력받고 
     * 닉네임만 리턴해주는 함수
     */
    getNickname: function (user_id) {
        let values = [
            [user_id]
        ];
        let sql = "SELECT nickname FROM user WHERE user_id = ?";

        return new Promise((resolve, reject) => {
            con.getConnection((err, con) => {
                if (err) new Error(err);
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
    /** 아이디를 입력받고 
     *  해당 유저 정보 전부 리턴
     */
    findProfilePath: function (user) {
        let sql = "SELECT * FROM user u WHERE u.user_id = ?;";

        return new Promise((resolve, reject) => {
            con.getConnection((err, con) => {
                if (err) new Error(err);
                con.query(
                    sql, [user.user_id], function (err, result) {
                        if (err) reject(err);
                        else resolve(result);
                    }
                )
                con.release();
            });
        });
    },
    /** 토큰이랑 소개글을 입력받고
     *  디비 업데이트 해주고 
     *  결과를 리턴하는 함수
     */
    uploadIntroduce: function (user_id, introduce) {
        let sql = "UPDATE user SET user_introduce = ? WHERE user_id = ?";

        return new Promise((resolve, reject) => {
            con.getConnection((err, con) => {
                if (err) new Error(err);
                con.query(
                    sql, [introduce, user_id], function (err, result) {
                        if (err) reject(err);
                        else resolve({response:"Good"});
                    }
                )
                con.release();
            });
        });
    },
    getBoardImage: async function(board_id){
        let sql = "SELECT board_image FROM board WHERE board_id = ?";

        return new Promise((resolve, reject) => {
            con.getConnection((err, con) => {
                if (err) new Error(err);
                con.query(
                    sql, [board_id], function (err, result) {
                        if (err) reject(err);
                        else resolve(result);
                    }
                )
                con.release();
            });
        });      
    }
};