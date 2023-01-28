/**댓글 제출 버튼*/
let btn_comment = document.getElementById("btn_comment");
/**댓글 입력 input*/
let input_comment_content = document.getElementById("input_comment_content");
/**부모 댓글 div*/
let comment_div = document.getElementById("comment_div");
/**게시판 지울때 사용하는 토큰*/
let board_delete_token = document.getElementById("board_delete_token");
/**게시판 삭제 form*/
let delete_board_form = document.getElementById("delete_board_form");
/**게시판 삭제 버튼*/
let btn_delete_board = document.getElementById("btn_delete_board");
/**자식 댓글 div*/
let c_newDiv = "";
/**댓글 페이징 처리 div */
let comment_page_div = document.getElementById("comment_page");

let url = window.location.pathname;
url = url.split('/');
/**borard_id 가져올려고 url입력 후 짜름*/
let board_id = url[4];
/**comment 페이지 */
let page_num = 0;
/** 댓글 페이징 처리 div*/
let page_newDiv = 0;
/**현재 댓글 페이지 */
let page = 0;
/** 댓글 마지막 페이지 */
let end_page = 0;

/** 서버에서 해당 게시물 아이디 내용물 가져옴
 * 
 *   아이디, 내용, 날짜 html에 찍어줌
 * 
 */
async function getComment(page_num) {
    page = page_num;
    let comment = await Get_pathVar(`http://localhost:3000/v3/board/comment/${board_id}/${page}`);
    end_page = comment.page.end_page;

    for (let i = 0; i < comment.comment.result.length; i++) {
        let time = comment.comment.result[i].comment_time;
        time = new Date(time); // 시간을 보기 좋게 변경

        let comment_html = "<hr>"
            + "<h5> 아이디: " + comment.comment.result[i].user_id + "</h5>"
            + "<h2>" + comment.comment.result[i].comment_content + "</h2>"
            + "<p>" + time.toLocaleString() + "</p>"
            + `<form type="hidden" method="post" action="/v3/board/comment/${comment.comment.result[i].comment_id}?_method=DELETE">`
            + `<input type="hidden" name="token" value="${token}">`
            + `<button class="btn btn-outline-danger" type=submit>` + "삭제" + "</button>";
        + "</form>"
        c_newDiv = document.createElement("div");

        c_newDiv.innerHTML = comment_html;

        c_newDiv.setAttribute("id", "comment_div_child");

        comment_div.appendChild(c_newDiv);

    }

    let comment_html = "";
    /**페이징 처리 화면 */
    for (let i = comment.page.start_page; i < comment.page.end_page; i++) {

        comment_html +=
            `
                        <button id="comment_page_btn" class="btn btn-outline-primary" value="${i}" onclick="btn_comment_paging(this.value);">${i + 1}</button>
                    `
    }
    let comment_state = `
                    <p style="color:red;">[ ${Number(page) + 1} ]<span>page</span></p>
                `
    let prev_btn = "";
    let next_btn = "";

    if (comment.page.prevPage == true) {

        prev_btn = `
                        <button class="btn btn-outline-primary" onclick="btn_comment_paging(${Number(page) - 1}); "> < 다음</button>
                    `
    }

    if (comment.page.nexPage == true) {

        next_btn = `
                        <button class="btn btn-outline-primary" onclick="btn_comment_paging(${Number(page) + 1});">이전 > </button>
                    `
    }
    page_newDiv = document.createElement("div");

    page_newDiv.innerHTML = prev_btn + comment_html + next_btn + comment_state;

    page_newDiv.setAttribute("id", "comment_page_div");

    comment_page_div.appendChild(page_newDiv);

};

/** 
 *  기존 html 한번 지워주고
 *  해당 댓글 페이지 값 넣어서
 *  다시 출력하는 함수
*/
function btn_comment_paging(value) {
    /**현재 페이지가 0~마지막 페이지를 벗어났을 떄 */
    if (value < 0) {
        value = 0;
    }
    if (value >= end_page) {
        value = end_page - 1;
    }
    reloadComment_Check();
    getComment(value);
};

/**
 * 댓글 작성 버튼 클릭하면 
 * 댓글 내용 입력받아서
 *  서버로 댓글 작성완료 응답을 받음
*/
btn_comment.addEventListener('click', async () => {

    if (input_comment_content.value == "") {
        alert("댓글을 작성해주세요!");
        return;
    } else if (token == undefined) {
        location.href = "/v2/login";
        alert("로그인을 하세요!");
        return;
    }

    let url = 'http://localhost:3000/v3/board/comment';
    let data = {
        "comment_id": 0,
        "user_id": "",
        "comment_content": `${input_comment_content.value}`,
        "board_id": `${board_id}`,
        "token": `${token}`,
    };
    let response = await Post_body(url, data);

    reloadComment_Check();

    getComment(page_num); //댓글 다시 불러오기

    input_comment_content.value = "";

    alert("댓글이 작성되었습니다.");
})
/** 댓글 내용, 댓글 페이징 처리 버튼 리로드 해주는 기능*/
function reloadComment_Check() {

    //기존에 댓글이 있다면 한번 지워주는 if문
    if (c_newDiv != "") {
        let parent = c_newDiv.parentElement; // 해당 자식태그 부모요소 가져오기
        while (parent.firstChild) {
            parent.removeChild(parent.lastChild); // 부모요소 안 자식태그 삭제
        }
    }
    /**기존에 넣어준 페이징 처리 버튼이 있으면 삭제*/
    if (page_newDiv != "") {
        let comment_parent_page = page_newDiv.parentElement;
        while (comment_parent_page.firstChild) {
            comment_parent_page.removeChild(comment_parent_page.lastChild);
        }
    }
}

/**게시판 삭제 클릭시 토큰도 같이 body
 * 에 넘어가게 하기
*/
board_delete_token.value = token;


/**
 * 페이지 처음 시작 시
 * 댓글 출력
 * 
*/
getComment(page_num);
