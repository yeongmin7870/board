const con = require('../config/mysqlconn.js');
const mysql = require('mysql2');
const search = require('../modules/home_search');
module.exports = {
    // 책 종류 가져오기
    getBookClassifications: function () {
        return new Promise((resolve, reject) => {
            con.getConnection((err, con) => {
                if (err) {
                    console.log(err);
                }
                con.query(
                    'SELECT * FROM book_classification', (err, result) => {
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
    //게시글 작성
    setBoard: function (board) {
        let { board_id, user_id, board_title, book_classification_id, board_contents, board_image, price } = board;
        values = [
            [board_id, user_id, board_title, book_classification_id, board_contents, board_image, price, 0, "판매"]
        ];
        // 토큰 해독

        return new Promise((resolve, reject) => {
            con.getConnection((err, con) => {
                if (err) {
                    console.log(err);
                }
                con.query(
                    'INSERT INTO board VALUES ?', [values], (err, result) => {
                        if (err)
                            reject(err);
                        else
                            resolve(result.insertId);
                    }
                );
                con.release();
            });
        })
    },
    /**
     *  메인페이지
     *  페이징 처리를 위한 count
     *  리턴하는 기능
     */
    getCntFindAll: function (board) {
        /** 검색조건, 게시물 상태에
         *  따라 sql문을 리턴해줌
         */
        const sql = search.count_search(board);

        return new Promise((resolve, reject) => {
            con.getConnection((err, con) => {
                if (err) {
                    console.log(err);
                }
                con.query(
                    sql, (err, result) => {
                        if (err)
                            reject(err);
                        else
                            resolve(result[0].cnt);
                    }
                );
                con.release();
            });
        })
    },
    /** 닉네임과 상태를 입력받고 
     *  디비에서 게시물 카운트 수를 리턴해주는
     *  함수
     */
    getCntFindStateBoard: function (board) {
        let sql = 'SELECT COUNT(*) as cnt FROM board b, user u WHERE ' +
            'u.nickname=? AND b.board_state=? AND b.user_id = u.user_id';

        if (board.board_state == "전체") {
            sql = 'SELECT COUNT(*) as cnt FROM board b, user u WHERE ' +
                'u.nickname=? AND b.user_id = u.user_id';
        }

        return new Promise((resovle, reject) => {
            con.getConnection((err, con) => {
                if (err) new Error(err);
                con.query(
                    sql, [board.nickname, board.board_state], (err, result) => {
                        if (err)
                            reject(err);
                        else
                            resovle(result);
                    }
                );
                con.release();
            })
        })
    },
    //게시글 내용 전체 가져오기
    getAllBoard: function (startColumn, columnSize, board) {

        const sql = search.board_content_search(startColumn, columnSize, board);

        return new Promise((resolve, reject) => {
            con.getConnection((err, con) => {
                if (err) {
                    console.log(err);
                }
                con.query(
                    sql, (err, result) => {
                        if (err)
                            reject(err);
                        else
                            resolve(result);
                    }
                );
                con.release();
            });
        })
    },
    /** 
     *  (object) mypage    
     *  (int) startColumn
     *  (int) columnsize
     *   @return
     *      게시물 상태와 컬럼 사이즈에 따라 
     *      게시물 + 유저정보 + 종류를 리턴함
     *      
     */
    FindByAllBoard: function (mypage, startColumn, columnSize) {
        let nickname = mypage.nickname;
        let board_state = mypage.board_state;
        let sql = "";
        let sql1 = "";
        /** 필요한 정보 */
        const needinfo = 'b.board_id, b.board_title, b.board_image, b.board_state, ' +
            'u.nickname';
        if (board_state == "전체") { // 전체 보기 
            sql1 = `select ${needinfo} from board b, book_classification bc,user u where ` +
                'u.nickname=? and b.book_classification_id = bc.book_classification_id and ' +
                'b.user_id = u.user_id ORDER BY b.board_id DESC LIMIT ?  OFFSET ?;';
            sql = mysql.format(sql1, [nickname, columnSize, startColumn]);
        } else { // 그외 판매중 or 예약중 or 판매완료 보기
            sql1 = sql1 = `select ${needinfo} from board b, book_classification bc,user u where ` +
                'u.nickname=? and b.board_state=? and b.book_classification_id = bc.book_classification_id and ' +
                'b.user_id = u.user_id ORDER BY b.board_id DESC LIMIT ?  OFFSET ?;';
            sql = mysql.format(sql1, [nickname, board_state, columnSize, startColumn]);
        }
        return new Promise((resolve, reject) => {
            con.getConnection((err, con) => {
                if (err) {
                    console.log(err);
                }
                con.query(
                    sql, (err, result) => {
                        if (err) {
                            reject(err);
                        }
                        else {
                            resolve(result);
                        }
                    }
                );
                con.release();
            });
        })
    },
    FindByBoard: function (board_id) {
        return new Promise((resolve, reject) => {
            con.getConnection((err, con) => {
                if (err) {
                    new Error(err);
                    return;
                }
                con.query(
                    'SELECT * FROM board b, book_classification bc, user u' +
                    ' WHERE b.board_id =? AND b.book_classification_id = bc.book_classification_id AND' +
                    ' b.user_id = u.user_id'
                    , [board_id], (err, result) => {
                        if (err)
                            reject(err);
                        else
                            resolve(result);
                    }
                );
                con.release();
            });
        })
    },
    view_count: (board_id) => {
        return new Promise((resovle, reject) => {
            con.getConnection((err, con) => {
                if (err) {
                    new Error(err);
                    return;
                }
                else {
                    con.query(
                        "UPDATE board a, (SELECT view_count+1 as 'view_count' FROM board WHERE board_id=?) b SET " +
                        "a.view_count=b.view_count WHERE board_id=?", [board_id, board_id], (err, result) => {
                            if (err) reject(err);
                            else resovle(result);
                        }
                    );
                }
                con.release();
            });
        });
    },
    doRmByBoard: function (board_id) {
        let sql1 = "DELETE FROM board b WHERE b.board_id = ?;";
        let sql2 = "DELETE FROM comment c WHERE c.board_id = ?; ";

        let sql_board = mysql.format(sql1, board_id);
        let sql_comment = mysql.format(sql2, board_id);

        return new Promise((resolve, reject) => {
            con.getConnection((err, con) => {
                if (err) {
                    console.log(err);
                }
                con.query(
                    sql_comment + sql_board, (err, result) => {
                        if (err)
                            reject(err);
                        else
                            resolve(result);
                    }
                );
                con.release();
            });
        })
    },

    changeBoardState: function (board) {
        let sql = "UPDATE board b SET b.board_state=? WHERE b.board_id=?;";

        let sql_board = mysql.format(sql, [board.board_state, board.board_id]);

        return new Promise((resolve, reject) => {
            con.getConnection((err, con) => {
                if (err) {
                    console.log(err);
                }
                con.query(
                    sql_board, (err, result) => {
                        if (err)
                            reject(err);
                        else
                            resolve(result);
                    }
                );
                con.release();
            });
        })
    },
    changeBoard: function (board, board_image) {
        let sql = "UPDATE board SET board_title=?, book_classification_id=?, board_contents=?, board_image=?, price=?  WHERE board_id=?;";
        let values = [board.board_title, board.book_classification_id, board.board_contents, board_image, board.price,board.board_id];
        
        return new Promise((resolve, reject) => {
            con.getConnection((err, con) => {
                if (err) {
                    console.log(err);
                }
                con.query(
                    sql, values, (err, result) => {
                        if (err)
                            reject(err);
                        else
                            resolve(result);
                    }
                );
                con.release();
            });
        })
    },
}