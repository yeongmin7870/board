module.exports = {
    /** 
     *  body, query, 빈값 , 체크후
     *  알맞은 값으로 넣어주는 함수
      */
    home_search_exception: (req) => {

        let { board_state, select_option, search_word, university_name, university_major } = "";

        const b = req.body;
        const q = req.query;
        let r = "";


        if (Object.keys(b).length > 1) { r = b };
        if (Object.keys(q).length > 1) { r = q };

        if (r.board_state) { board_state = r.board_state; } else { board_state = "전체" }
        if (r.select_option) { select_option = r.select_option } else { select_option = "제목" }
        if (r.search_word) { search_word = r.search_word } else { search_word = ""; }
        if (r.university_name) { university_name = r.university_name } else { university_name = ""; }
        if (r.university_major) { university_major = r.university_major } else { university_major = ""; }


        return { board_state, select_option, search_word, university_name, university_major };
    },
}