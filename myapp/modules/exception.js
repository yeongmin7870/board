module.exports = {
    home_search_exception(req, board_state, select_option, search, university_name, university_major) {
        /** 게시판 상태 변수가 쿼리로 넘어오지 않았다면 */
        if (req.query.board_state == undefined) {
            /** 게시판 상태 변수가 쿼리, body 둘다 넘어오지 않았다면 */
            if (req.body.board_state == "" || req.body.board_state == undefined) {
                board_state = "전체";
            } else {
                board_state = req.body.board_state;
            }
        } else {
            board_state = req.query.board_state;
        }

        /** 옵션 선택 변수가 쿼리로 넘어오지 않았다면 */
        if (req.query.select_option == undefined) {
            /** 옵션 선택 변수가 쿼리, body 둘다 넘어오지 않았다면 */
            if (req.body.select_option == "" || req.body.select_option == undefined) {
                select_option = "제목";
            } else {
                select_option = req.body.select_option;
            }
        } else {
            select_option = req.query.select_option;
        }

        /** 검색 변수가 쿼리로 넘어오지 않았다면 */
        if (req.query.search == undefined) {
            /** 검색 변수가 쿼리, body 둘다 넘어오지 않았다면 */
            if (req.body.search == "" || req.body.search == undefined) {
                search = "";
            } else {
                search = req.body.search;
            }
        } else {
            search = req.query.search;
        }

        /** 학교명 변수가 쿼리로 넘어오지 않았다면 */
        if (req.query.university_name == undefined) {
            /** 검색 변수가 쿼리, body 둘다 넘어오지 않았다면 */
            if (req.body.university_name == "" || req.body.university_name == undefined) {
                university_name = "";
            } else {
                university_name = req.body.university_name;
            }
        } else {
            university_name = req.query.university_name;
        }
        /** 학과 변수가 쿼리로 넘어오지 않았다면 */
        if (req.query.university_major == undefined) {
            /** 검색 변수가 쿼리, body 둘다 넘어오지 않았다면 */
            if (req.body.university_major == "" || req.body.university_major == undefined) {
                university_major = "";
            } else {
                university_major = req.body.university_major;
            }
        } else {
            university_major = req.query.university_major;
        }
        return { board_state: board_state, select_option: select_option, search: search, university_name: university_name, university_major: university_major };
    },
}