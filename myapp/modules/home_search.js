const mysql = require('mysql2');

module.exports = {
    /** 검색조건을 입력받고 
     *  하나씩 나눈다음에 
     *  알맞은 sql문으로 리턴
     */
    makeSearchSql: function (option, search_word) {
        /** 검색 문자열 배열로 만들기 */
        let word_array = [...search_word];
        /** 검색하는 sql 조건문 */
        let sql = "";
        for (let i = 0; i < word_array.length; i++)
            if (word_array[i] != " ")
                sql += `AND ${option} like "%${word_array[i]}%" `;
        return sql;
    },

    /** 
     *  메인페이지 count 세기 
     * 
     * @param {*} board 
     *  board_state, select_option , search 입력받으면 
     *  알맞은 알고리즘으로 sql문을 리턴시켜주는 함수
     *
     */
    count_search: function (board) {
        let sql = 'SELECT COUNT(*) as cnt FROM board b, user u, ' +
            'book_classification bc WHERE u.user_id = b.user_id AND ' +
            'b.book_classification_id = bc.book_classification_id AND ';
        let option = board.select_option;
        /** 검색 sql 문 */
        let search_sql = "";
        let university_sql = ' b.university_name like ? AND b.university_major like ? '
        /** 검색 조건 */
        switch (option) {
            case "제목":
                option = "b.board_title";
                break;
            case "종류":
                option = "bc.book_classification_name";
                break;
            case "닉네임":
                option = "u.nickname";
                break;
        }

        /** 
         * 만약 검색조건이 있다면
         * 검색조건을 가공해서 sql문을 리턴하는 함수 */
        if (board.search != "")
            search_sql = this.makeSearchSql(option, board.search);

        if (board.board_state == "전체") { // 게시판 상태가 전체라면
            /** 검색조건이 있다면 */
            if (board.search == "") { // 게시판 상태: 전체 + 검색 조건: 없음
                sql = 'SELECT COUNT(*) as cnt FROM board';
            } else {    //게시판 상태: 전체 + 검색 조건: 있음 + 학교조건 있음
                sql += `${university_sql}`;
            }
            sql = mysql.format(sql, [`${board.university_name}`, `${board.university_major}`]);
        } else { // 게시판 상태가 전체가 아니면
            /** 검색조건이 있다면 */
            if (board.search == "") { // 게시판 상태: 그외 상태들 + 검색 조건: 없음
                sql += 'board_state = ?'
            } else {    //게시판 상태: 그외 상태들 + 검색 조건: 있음 + 학교조건 있음
                sql += `board_state = ? AND ${university_sql}`;
            }

            sql = mysql.format(sql, [board.board_state, `${board.university_name}`, `${board.university_major}`]);
        }
        /** 검색 sql 문도 추가 */
        sql += search_sql;
        return sql;
    },
    /** 
     *  startColumn, columnSize
     *  ,board[object] 를 입력받으면
     *  검색조건에 맞게
     *  게시판 sql문을 
     *  리턴해주는 함수 
     */
    board_content_search: function (startColumn, columnSize, board) {
        let sql = 'SELECT * FROM board b, user u, book_classification bc ' +
            'WHERE b.user_id = u.user_id AND b.book_classification_id = bc.book_classification_id ';
        let order = ' ORDER BY board_id DESC LIMIT ?  OFFSET ?;'
        let option = board.select_option;
        let university_sql = 'AND b.university_name like ? AND b.university_major like ?'
        /** 검색 sql 문 */
        let search_sql = "";

        /** 검색 조건 */
        switch (option) {
            case "제목":
                option = "b.board_title";
                break;
            case "종류":
                option = "bc.book_classification_name";
                break;
            case "닉네임":
                option = "u.nickname";
                break;
        }

        /** 
        * 만약 검색조건이 있다면
        * 검색조건을 가공해서 sql문을 리턴하는 함수 */
        if (board.search != "")
            search_sql = this.makeSearchSql(option, board.search);

        if (board.board_state == "전체") { // 게시판 상태가 전체라면
            /** 검색조건이 있다면 */
            if (board.search == "") { // 게시판 상태: 전체 + 검색 조건: 없음
                sql = sql;
            } else {    //게시판 상태: 전체 + 검색 조건: 있음 + 학교조건 있음
                sql += `${search_sql} ${university_sql}`;
            }
            sql = mysql.format(sql, [`${board.university_name}`, `${board.university_major}`]);
        } else { // 게시판 상태가 전체가 아니면
            /** 검색조건이 있다면 */
            if (board.search == "") { // 게시판 상태: 그외 상태들 + 검색 조건: 없음
                sql += 'AND board_state = ?'
            } else {    //게시판 상태: 그외 상태들 + 검색 조건: 있음 + 학교조건 있음
                sql += `AND board_state = ? ${search_sql} ${university_sql}`;
            }

            sql = mysql.format(sql, [board.board_state, `${board.university_name}`, `${board.university_major}`]);
        }
        sql = mysql.format(sql + order, [columnSize, startColumn]);
        return sql;
    },
}