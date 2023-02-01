btn_signin = document.getElementById('btn_signin');
btn_signout = document.getElementById('btn_signout');
let write = document.getElementById('write');
let mypage = document.getElementById('mypage');
let token_form = document.getElementById('token_form'); //토큰 보내는 form
let input_token = document.getElementById('input_token'); // 토큰 보내는 input 
let board_state = document.getElementById('board_state'); // 게시판 상태를 저장하는 input

write.addEventListener('click', event => {
    token_form.action = `/v2/write?_method=GET`
    input_token.value = token;
    token_form.submit();
});

mypage.addEventListener('click', async event => {
    if (token == "") {
        alert("로그인 하세요");
        location.href = "/v2/login";
        return;
    }
    let name = await Post_body("/v1/getnickname?_method=GET", { data: token });
    if (name.nickname == "need login") {
        console.log("tlqkf");
        alert("로그인 하세요");
        location.href = "/v2/login";
        return;
    }
    token_form.action = `/v3/board-mypage/${name.nickname}?_method=GET`
    input_token.value = token;
    token_form.submit();
})

function btn_login() {
    if (token) { // 쿠키에 토큰이 있다면 // <로그인 상태>
        btn_signout.style.display = 'block'; // 로그아웃 버튼 활성화
        btn_signin.style.display = 'none'; // 로그인 버튼 비활성화
    } else { // <로그인이 안된 상태>
        btn_signin.style.display = 'block'; // 로그인 버튼 활성화
        btn_signout.style.display = 'none'; // 로그아웃 버튼 비활성화
    }
}

/** 게시판 상태 분류 버튼을 클릭했을때 알맞은 페이지로 이동
 *  해주는 함수
 */
function btn_board_state(b) {
    board_state.value = b.value;
    location.href = `/v2/home/0?board_state=${board_state.value}`;
}

/** 가져오고 싶은 이름을 주면 
 * url 파라미터에서 
 * 해당 이름을 가진 데이터를 가져오는 함수*/
function getParma(data) {
    let params = (new URL(document.location)).searchParams;
    let result = params.get(`${data}`);
    return result;
}

/** 현재 게시판 상태를 저장해주는
 *  함수
 */
function saveBoardState(state) {
    /** 현재 게시판 상태 값이 비어있다면  */
    if (board_state.value == "") {
        /** url에 board_state 값이 없다면 "전체"
         *  아니라면 url 짜르고 값넣기 
          */
        board_state.value = (getParma(state) == "undefined") ? "전체" : getParma(state);
    }

}

/**
 *  게시판 상태에 따라서 
 *  해당하는 버튼 비활성화
 */
function buttonDisabled() {
    let btn_id = "";
    switch (board_state.value) {
        case "전체":
            btn_id = "btn_all";
            break;
        case "판매":
            btn_id = "btn_sell";
            break;
        case "예약":
            btn_id = "btn_reservation";
            break;
        case "판매완료":
            btn_id = "btn_soldout";
            break;
    }
    const target = document.getElementById(btn_id);
    target.disabled = true;
}

/** 
 * selection option 값 입력받으면
 * selete 옵션 선택 */
function selectOption() {
    let select_option = document.getElementById("select_option");
    let searchAfterOption = document.getElementById("input_select_option");
    let i = 0;
    setTimeout(() => {
        switch (searchAfterOption.value) {
            case "제목":
                i = 0;
                break;
            case "종류":
                i = 1;
                break;
            case "닉네임":
                i = 2;
                break;
        }
        select_option.options[i].selected = true;
    }, 1);
}

/** 메인 함수 */
function main() {
    buttonDisabled();
    saveBoardState("board_state"); // 현재 게시판 상태를 확인하고 변수에 저장함
    /** 사용자가 검색할때 체크했던 옵션
     *  다시 체크해주는 함수
     */
    selectOption();
    /** 로그인 버튼 컨트롤 */
    btn_login();
}

main();



