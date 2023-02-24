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
/** 필요한 대학 학과만 가져온 정보 */
let university_major = [];


/** 클릭 한번만 대학 정보 가져오기 */
input_university_name.addEventListener('mouseout', () => {
    /** 대학 입력 자동완성 보조 */
    autoUniversity_name();
    universityinfo();
    stateUniversity();

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
            <div style="text-align:center;">
            <img src="/images/loading.gif">
            </div>
        `
        /** 전공 선택 불가능 */
        const getUniversity = setInterval(() => {
            if (university != "") {
                loading.innerHTML = "";
                clearInterval(getUniversity);
            }
        }, 1000)
    }
}
/** input 한번 초기화시키고 
 *  대학교를 붙여줌
 */
function set_university_input(u) {
    input_university_name.value = "";
    for (w of u) input_university_name.value += w;
    /** 대학명 입력칸이 빈킨이 아닐때만 */
    if (input_university_name.value) input_university_name.value += "대학교"
}

/**
 *  뒤에서부터 탐색해서 
 *  "대학교" 문자열을 뺴주는
 *  함수
 */
let w_university = "";
function delete_university(word) {
    let word2 = [];
    word2 = word;

    /** 
     * 뒤에서부터 대를 찾아가면서 pop 시킴 */
    for (let i = word2.length - 1; i >= 0; i--) {
        if (word2[i] == "대") {
            word.pop();
            break;
        } else {
            word.pop();
        }
    }
    w_university = ""
    for (w of word)
        w_university += w;
}

/** 
 *  대학명 입력 
 *  보조해주는 함수
 * 
 */
function autoUniversity_name() {
    let university_name_input = input_university_name.value.trim();
    /** 입력된 값 공백제거 후 배열에 넣기 */
    let word = [...university_name_input];
    /** 대라는 문자 판별  */
    if (university_name_input.match("대")) {
        /** 첫번쨰 문자 대 없으면  */
        if (university_name_input.match("대").index != 0) {
            delete_university(word);
            set_university_input(word);
        } else {
            /** "대" 문자 카운트 */
            let w_count = [];
            for (w of word) w_count.push(w);
            /** "대" 문자가 2개이상일때 */
            if (w_count.length - 1 > 1) {
                delete_university(word);
                set_university_input(word);
                /** "대" 문자가 2개 미만일때 */
            } else {
                set_university_input(university_name_input);
            }
        }

    } else {
        set_university_input(university_name_input);
    }
}

function createOption(value) {
    let newOption = document.createElement('option');
    university_major.push(value);
    newOption.text = value;
    newOption.value = value;
    select_major.appendChild(newOption);
}

/**select 박스를 누르면 관련학교 데이터를 검색해서 보여주게하는 함수*/
select_major.addEventListener('mousedown', async function getSelectOptionInfo() {
    autoUniversity_name();
    stateUniversity();
    await universityinfo();

    while (select_major.childNodes.length >= 1) select_major.removeChild(select_major.firstChild);

    createOption("학과를 선택해주세요");
    for (let i = 0; i < university.length; i++) {
        if (input_university_name.value == university[i].대학명) createOption(university[i].학과);
    }

})

btn_finish.addEventListener('click', () => {

    if (title.value == "") return alert("제목을 써주세요!");
    else if (select_major.value == "학과를 선택해주세요") return alert("전공을 선택해주세요!");
    else if (price.value == "") return alert("가격을 입력해주세요!")
    else if (board_contents.value == "") return alert("내용을 써주세요!");
    else if (board_image.value != "") {
        const file_name = board_image.value.split("\\");
        const e1 = file_name[2].split(".");
        const e = e1[e1.length - 1].toUpperCase();

        if (e != "BMP" && e != "JPEG" && e != "JPG" && e != "JPEG2000" && e != "GIF" && e != "PNG" && e != "SVG") { return alert("이미지 파일이 아닙니다!"); }
        else form_board.submit();
    } else return alert("이미지를 올려주세요!");

})