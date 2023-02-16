let btn_profile = document.getElementById("btn_profile"); // 수정버튼
let newContentDiv = ""; // 마이페이지 게시물 내용 자식 div
let current_page = 0; // 게시판 내용 보고 있는 현재 페이지
let div_numberbar_arrow = document.getElementById("div_numberbar_arrow"); // 페이지 숫자 막대기랑, 이전페이지, 다음페이지 버튼 div
let div_new_numberbar_arrow = ""; // div_numberbar_arrow 자식 div
const nowNickname = document.getElementById("nowNickname"); //현재 닉네임 input
const mypageNickname = nowNickname.value; //마이페이지 닉네임
let mypage_board_content = document.getElementById("mypage_board_content"); // 마이페이지 게시물 내용 부모 div
let btn_board_state = "전체"; // 현재 내가 어떤 게시판 상태 버튼을 눌렀는지 확인하는 변수;
let url = ""; // 마이페이지 게시판 내용물 및 네비게이션 바 주소를 담는 값

/** 토큰을 받으면 닉네임으로 프로필 수정권한을 체크 해주고
 *  맞다면 수정 팝업창을 보여주는 함수
 */
btn_profile.addEventListener("click", async () => {
    const t = await Post_body("/v1/getnickname?_method=GET", { data: token }); // 토큰으로 가져온 닉네임
    const tokenNickname = t.nickname;
    if (tokenNickname == mypageNickname) {
        window.open("/v2/profile-popup", "프로파일 수정", "width=400, height=300, top=10, left=10");
    } else {
        alert("자신의 마이페이지가 아니기 때문에 프로파일을 수정할 수 없습니다.");
    }
})
/** 클릭한 버튼 아이디를 입력받으면
 *  한번 전부 비활성화 풀어주고
 *  클릭한 버튼을 비활성화 시킴
 */
function buttonDisabled(b, c) {
    const target = document.getElementById(b.id);
    let childBtn = document.getElementById(`${c}`).getElementsByTagName('*');
    for (let btn of childBtn) {
        btn.disabled = false;
    }
    target.disabled = true;
    btn_getContent(target);
}
/**버튼 누르면 해당 내용을 가져옴*/
async function btn_getContent(btn) {
    if (btn.value) {
        btn_board_state = btn.value; // 현재 선택한 게시판 상태 분류 버튼 저장
        current_page = 0; // 게시판 상태 분류 버튼을 선택했으므로 현재페이지를 다시 0으로 만들어줌
    }

    url = `/v3/board-mypage-content/${nowNickname.value}?board_state=${btn_board_state}&&current_page=${current_page}`
    const content = await Get_pathVar(url);

    deleteBtnDiv();
    makeNavigationBar(content.numberbar_arrow);

    deleteDiv(); // 기존에 요소가 있다면 삭제
    makeboardContent(content.board.result);

}

/** 최초의 한번만 실행 
 *  전체 게시판 내용 가져오기
*/
async function all_getContent() {
    url = `/v3/board-mypage-content/${nowNickname.value}?board_state=전체&&current_page=${current_page}`
    const content = await Get_pathVar(url);

    makeboardContent(content.board.result);

    makeNavigationBar(content.numberbar_arrow);

}
/** 마이페이지 고객이 작성한 게시물 출력 해주는 함수*/
function makeboardContent(content) {
    if (content.length != 0) { //테이블 헤드

        for (let i = 0; i < content.length; i++) { // 테이블 본체 
            let content_html = `
                    <div id="div_boardImage_${content[i].board_id}" style="float: left; width: 33%;">
                        <a style="text-decoration: none;" href="/v3/board/page/${content[i].board_id}">
                        <div style="position:relative">
                            <p style="color:gray; position: absolute; top: 50%; left: 47%;">${content[i].board_state}<p>
                            <img src="/images/${content[i].board_image}" style="width: 30%; height:100px;">
                        </div>
                        <p style="color: black;">${content[i].board_title}</p></a> 
                        <input type="hidden" value="${content[i].board_state}" id="input_boardImage_${content[i].board_id}">
                    </div>
            `;

            newContentDiv = document.createElement("div");
            newContentDiv.innerHTML = content_html;
            newContentDiv.setAttribute("id", "board_div_child");
            mypage_board_content.appendChild(newContentDiv);

            let input_boardImage = document.getElementById(`input_boardImage_${content[i].board_id}`);
            let div_boardImage = document.getElementById(`div_boardImage_${content[i].board_id}`);
            stateOpacity(input_boardImage, div_boardImage); // 상태에 따라서 투명화 시키기 

        }
    } else {
        let comment_html = `<h4>데이터가 없습니다.</h4>`;
        newContentDiv = document.createElement("div");
        newContentDiv.innerHTML = comment_html;
        newContentDiv.setAttribute("id", "board_div_child");
        mypage_board_content.appendChild(newContentDiv);
    }
}

/**상태에 따라서 투명화 시켜주는 함수 */
function stateOpacity(input_boardImage, div_boardImage) {

    if (input_boardImage.value == "예약" || input_boardImage.value == "판매완료") {
        div_boardImage.style.opacity = "0.6";
    }
}

/** 기존 게시판 image에 요소가 있다면 지워주는 함수
 */
function deleteDiv() {
    //기존에 게시판 이미지가 있다면  지워주는 if문
    if (newContentDiv != "") {
        let parent = newContentDiv.parentElement; // 해당 자식태그 부모요소 가져오기

        while (parent.firstChild) {
            parent.removeChild(parent.lastChild); // 부모요소 안 자식태그 삭제
        }
    }
}
/** 기존에 네비게이션바가 있다면
 *  한번 지워주는 함수
 */
function deleteBtnDiv() {
    if (div_new_numberbar_arrow != "") {
        let parent = div_new_numberbar_arrow.parentElement;

        while (parent.firstChild) {
            parent.removeChild(parent.lastChild);
        };
    }
}

/** 페이지 숫자 막대 및 이전,
 * 다음페이지 화살표 생성
 *  하는 함수 */
function makeNavigationBar(content) {
    if (content.end_page != 0) {
        let html = "";
        for (let i = content.start_page; i < content.end_page; i++) {
            html += `
            <div style="float: left; width: 3%;">
                <button class="btn btn-outline-success" type="button" id="btn_nav${i}" onclick="btn_nav_arrow_click(this)" value="${i}">${i + 1}</button>
            </div>
        `;
        }
        div_new_numberbar_arrow = document.createElement("div");
        div_new_numberbar_arrow.innerHTML = html + `<p style="color:red">페이지: [${Number(current_page) + 1}]</p>`;
        div_new_numberbar_arrow.setAttribute("id", "btn_mypage");
        div_numberbar_arrow.appendChild(div_new_numberbar_arrow);
    } else {
        let html = `
        <div style="float: left;">
        </div>
        `;
        div_new_numberbar_arrow = document.createElement("div");
        div_new_numberbar_arrow.innerHTML = html;
        div_new_numberbar_arrow.setAttribute("id", "btn_mypage");
        div_numberbar_arrow.appendChild(div_new_numberbar_arrow);
    }
}
/** 네비게이션 바 클릭시 네비게이션 바
 *  disabled 만들고
 * 이미지 내용물 달라지게 하기*/
function btn_nav_arrow_click(b) {

    current_page = b.value; // 현재페이지를 클릭한 버튼 값으로 변경
    /** 이미지 내용물 달라지게 하기*/
    btn_getContent(btn_board_state);

}
/** 자기소개글 수정
 *  팝업창
 */
async function btn_introduce() {
    const t = await Post_body("/v1/getnickname?_method=GET", { data: token }); // 토큰으로 가져온 닉네임
    const tokenNickname = t.nickname;

    if (tokenNickname == mypageNickname) {
        window.open("/v2/introduce-popup", "소개글 수정", "width=400, height=300, top=10, left=10");
    } else {
        alert("자신의 마이페이지가 아니므로 자기소개 글을 수정할 수 없어요!");
        return;
    }
}

/** 메인 함수 */
function main() {
    all_getContent();
}



main();

