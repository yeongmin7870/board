const select_major = document.getElementById("select_major");
const input_university_name = document.getElementById("input_university_name");
const oneClickctl = document.getElementById("oneClickctl");
const loading = document.getElementById("loading");
const btn_finish = document.getElementById("btn_finish");
const form_board = document.getElementById("form_board");
const title = document.getElementById("title");
const price = document.getElementById("price");
const board_contents = document.getElementById("board_contents");
let university = [];

/** 클릭 한번만 대학 정보 가져오기 */
input_university_name.addEventListener('click', () => {
    if (oneClickctl.value == "yes") { universityinfo(); stateUniversity(); oneClickctl.value = "no" }
})

/**먼저 대학 관련 정보 가져오기 */
async function universityinfo() {
    const response = await fetch("/v5/find/university");
    const result = await response.json();
    university = result;
}
/** 대학정보 가져왔는지 체크해주는 함수 */
function stateUniversity() {
    if (university == "") {
        loading.innerHTML = `
           <h4 id="state_ext">학교 데이터를 가져오는 중 입니다.<br>
            금방되니, 잠시만 기다렸다가 학과를 선택해주세요!🐶</h4>
        `
        /** 전공 선택 불가능 */
        const getUniversity = setInterval(() => {
            if (university != "") {
                loading.innerHTML = "";
                select_major.disabled = false;
                clearInterval(getUniversity);
            }
        }, 500)
    }
}
/**select 박스를 누르면 관련학교 데이터를 검색해서 보여주게하는 함수*/
select_major.addEventListener('click', () => {
    let university_major = [];
    select_major.innerHTML = ""
    select_major.innerHTML = "<option>학과를 선택해주세요</option>"

    for (let i = 0; i < university.length; i++) {
        if (input_university_name.value == university[i].대학명) {
            university_major.push(university[i].학과);
            select_major.innerHTML += `<option>${university[i].학과}</option>`;
            if (input_university_name.value != university[i].대학명) return;
        }
    }
})

btn_finish.addEventListener('click', () => {
    if (title.value == "") return alert("제목을 써주세요!");
    else if (select_major.value == "학과를 선택해주세요") return alert("전공을 선택해주세요!");
    else if (price.value == "") return alert("가격을 입력해주세요!")
    else if (board_contents.value == "") return alert("내용을 써주세요!");
    else form_board.submit();
})