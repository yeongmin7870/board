const con = require('../config/mysqlconn.js');
const mysql = require('mysql2');
// const redis_con = require('../config/redisconn');
const { response } = require('express');
module.exports = {
    /** 아이디를 입력받으면
     *  채팅방에대한 정보
     *  리턴
     */
    checkedRoom: (user_id) => {
        const sql = "SELECT * FROM chat_room WHERE " +
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
    /** 유저 아이디, 방이름을 입력받으면
     *  채팅방을 생성해주고 결과를 리턴
     */
    makeRoom: (room) => {
        const sql = "INSERT INTO chat_room VALUES (?)";
        const values = [
            [0, room.chat_room_name, 0, room.sender_id, room.receiver_id]
        ]
        return new Promise((resovle, reject) => {
            con.getConnection((err, con) => {
                if (err) throw (err);
                con.query(sql, values, (err, result) => {
                    if (err) reject(err);
                    else resovle(result);
                });
                con.release();
            });
        });
    },
    /** 채팅방 이름을 받으면
     *  비활성화 해주는 함수
     */
    changeState: (room) => {
        const sql = "UPDATE chat_room SET  chat_room_state = 1 WHERE chat_room_name= (?)";
        const values = [
            [room.chat_room_name]
        ]
        return new Promise((resovle, reject) => {
            con.getConnection((err, con) => {
                if (err) throw (err);
                con.query(sql, values, (err, result) => {
                    if (err) reject(err);
                    else resovle(result);
                });
                con.release();
            });
        });
    },
    myRoomList: (user_id) => {
        const sql = "SELECT chat_room_name FROM chat_room WHERE chat_room_state = 0 AND " +
            "sender_id=(?) OR receiver_id=(?)";
        const values = [
            [user_id],
            [user_id]
        ]
        return new Promise((resovle, reject) => {
            con.getConnection((err, con) => {
                if (err) throw (err);
                con.query(sql, values, (err, result) => {
                    if (err) reject(err);
                    else resovle(result);
                });
                con.release();
            });
        });
    },
    /** 송신자 , 수신자 아이디 받고
     *  둘이 같은 채팅방에 있는지 확인해주는 함수
     */
    checkedOneByRoom: (sender_id, receiver_id) => {
        const sql = "SELECT chat_room_name FROM chat_room WHERE chat_room_state = 0 AND " +
            "sender_id=(?) AND receiver_id=(?) OR " +
            "sender_id=(?) AND receiver_id=(?)";
        const values = [
            [sender_id],
            [receiver_id],
            [receiver_id],
            [sender_id]
        ]
        return new Promise((resovle, reject) => {
            con.getConnection((err, con) => {
                if (err) throw (err);
                con.query(sql, values, (err, result) => {
                    if (err) reject(err);
                    else resovle(result);
                });
                con.release();
            });
        });
    },
    /** Redis String 형으로 
     *  Key, Value 형식으로 저장
     */
    // writeChat: async () => {
    //     const response = await redis_con.set('hihi', "22")
    //         .catch((err) => console.log(err));
    //     if (JSON.stringify(response) != undefined) return "did save chat";
    //     else return "can't save chat";
    // },
    /** Key값으로 값을 
     *  꺼내는 함수 
     */
    // getChat: async () => {
    //     const response = await redis_con.get('hihi');
    //     return response;
    // }
}