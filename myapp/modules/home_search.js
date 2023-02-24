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
            /** 공백이 아닐시F */
            if (word_array[i] != " ")
                if (i == 0) { sql += `${option} like "%${word_array[i]}%"`; } else { sql += ` AND ${option} like "%${word_array[i]}%" `; }
        return sql;
    },
    /** 검색 조건 */
    getSearchOption: function (o) {
        let option = "";
        /** 검색 조건 */
        if (o == "제목") return option = "b.board_title";
        if (o == "종류") return option = "bc.book_classification_name";
        if (o == "닉네임") return option = "u.nickname";
    },

    /** 
     *  메인페이지 count 세기 
     * 
     * @param {*} board 
     *
     */
    count_search: function (board) {
        const and = " AND ";
        /** 고정 sql 문 */
        let sql = 'SELECT COUNT(*) as cnt FROM board b, user u, book_classification bc' +
            ' WHERE u.user_id = b.user_id AND b.book_classification_id = bc.book_classification_id';

        /** 대학명 */
        let university_name_sql = board.university_name ? 'b.university_name like ?' : "";
        /** 대학 전공 */
        let university_major_sql = board.university_major != "학과를 선택해주세요" ? 'b.university_major like ?' : "";
        if (university_major_sql == "") { board.university_major = "" };
        /** 게시물 상태 : 전체가 맞다면 빈값을 넣어줌 */
        let board_state_sql = board.board_state != "전체" ? "board_state = ?" : "";
        if (board_state_sql == "") { board.board_state = "" };
        /** 검색 옵션 */
        const option = this.getSearchOption(board.select_option);
        /** 검색 */
        let search_word_sql = board.search_word ? this.makeSearchSql(option, board.search_word) : "";

        const b = ["university_name", "university_major", "board_state", "search_word"];
        const b_sql = { university_name: university_name_sql, university_major: university_major_sql, board_state: board_state_sql, search_word: search_word_sql };

        for (i of b) if (board[i]) { sql += and + b_sql[i]; sql = mysql.format(sql, [board[i]]) };

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
        const and = " AND ";
        let sql = 'SELECT * FROM board b, user u, book_classification bc ' +
            'WHERE b.user_id = u.user_id AND b.book_classification_id = bc.book_classification_id ';

        /** 대학명 */
        let university_name_sql = board.university_name ? 'b.university_name like ?' : "";
        /** 대학 전공 */
        let university_major_sql = board.university_major != "학과를 선택해주세요" ? 'b.university_major like ?' : "";
        if (university_major_sql == "") { board.university_major = "" };
        /** 게시물 상태 : 전체가 맞다면 빈값을 넣어줌 */
        let board_state_sql = board.board_state != "전체" ? "board_state = ?" : "";
        if (board_state_sql == "") { board.board_state = "" };
        /** 검색 옵션 <옵션값은 무조건 "전체"가 있음> */
        const option = this.getSearchOption(board.select_option);
        /** 검색 */
        let search_word_sql = board.search_word ? this.makeSearchSql(option, board.search_word) : "";
        let order_sql = ' ORDER BY board_id DESC LIMIT ?  OFFSET ?;'

        const b = ["university_name", "university_major", "board_state", "search_word"];
        const b_sql = { university_name: university_name_sql, university_major: university_major_sql, board_state: board_state_sql, search_word: search_word_sql };

        for (i of b) if (board[i]) { sql += and + b_sql[i]; sql = mysql.format(sql, [board[i]]) };
        sql = mysql.format(sql + order_sql, [columnSize, startColumn]);

        return sql;
    },
}