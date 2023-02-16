let checkEmailBtn = document.getElementById('checkEmailBtn'); // 이메일 확인 버튼
let checkCodeBtn = document.getElementById('checkCodeBtn'); // 승인코드 확인 버튼
let codeTimer = document.getElementById('codeTimer');       // 유효코드 타이머 
let resendcodeBtn = document.getElementById('resendCode');  // 다시 승인코드 보내는 버튼

let emailFront = document.getElementById('emailFront'); // email @ 앞자리
let selectEmail = document.getElementById('selectEmail'); // email 뒷자리 option 선택
let user_email = document.getElementById('user_email'); // 서버로 보내줄 user_email 칸
let directEmail = document.getElementById('directEmail'); // 직접입력
let codeBox = document.getElementById('codeBox'); // 승인 코드 입력 칸
let checkedNickname = document.getElementById('checkedNickname'); // 닉네임 중복이면 값이 없게 끔 만들어서 회원가입을 못하게 함
let address = document.getElementById("address"); // 주소입력칸
let nickname = document.getElementById("nickname"); // 닉네임 칸 
let nicknameInfo = document.getElementById("nicknameInfo"); // 닉네임 중복여부 알림 
let btn_register = document.getElementById("btn_register"); //회원가입 버튼
let createUser = document.getElementById("createUser"); //회원가입 form

let auth_code = false; // 승인코드 완료 여부
let directEmail_controlClick = false; // 직접 입력 옵션 클릭 여부
let timer = ""; //승인코드 타이머
let info = "";  // 회원 닉네임 여부  1. 없는 닉네임 입니다. 2. 이미 있는 닉네임 입니다. 
let emailcode = ""; // 서버로 부터 반환 받은 이메일 코드
let backForbiden = true; // 뒤로가기 후 회원가입 방지

function btnCheckEmail() {

    if (checkEmailBtn.style.display == 'block' && user_email.value.search(/@/) != -1) {   // 이메일 확인 버튼이 있고 @을 포함해서 뒷자리까지 입력했다면
        checkEmailBtn.style.display = 'none';       //  이메일 버튼 -> 숨기기 && 승인코드 버튼 -> 생성 && 타이머 -> 생성
        checkCodeBtn.style.display = 'block';
        resendcodeBtn.style.display = 'block';

        codeBox.style.display = 'block'
        codeTimer.style.display = 'block'
        authTimer(); // 승인 코드 타이머
        sendCode(); // 승인코드 보내기

    } else {
        alert("이메일을 입력해주세요!");
    }

}
// 승인코드 타이머
function authTimer() {
    let time = 300;
    let min = 0;
    let sec = 0;

    timer = setInterval(() => {

        min = parseInt(time / 60);
        sec = time % 60;
        time -= 1;

        codeTimer.innerText = min + "분" + sec + "초";

        if (time <= 0) {
            clearInterval(timer); // setInterval() exit
            codeTimer.innerText = "승인코드를 다시 받으세요.";

            checkCodeBtn.style.display = 'none'
            emailcode.value = ""; // 서버로부터 받은 승인코드 초기화
        }
    }, 1000);
}

function resendBtn() { // 승인코드 다시 보내주기 버튼을 누른다면
    checkCodeBtn.style.display = 'block';
    resendcodeBtn.style.display = 'block';
    authTimer();
    sendCode(); // 승인코드 보내기
}

function autoEmail() { // 유저가 이메일 선택한거 정리
    user_email.value = emailFront.value + selectEmail.value;
    directEmailBtn(); // 직접 입력 선택 여부
}


function directEmailOption() {  // 직접 입력 칸 입력시 서버보내줄 칸으로 값들어가기
    user_email.value = emailFront.value + "@" + directEmail.value;
}

function directEmailBtn() { // 직접 입력 선택 여부
    if (selectEmail.value == "null") { // 직접 입력선택을 눌렀다면
        directEmail.style.display = "block";
        directEmail.disabled = false;
    } else {
        directEmail.style.display = "none";
        directEmail.disabled = true;
    }
}

function btn_register_event() { // 회원가입 눌렀을때

    if (id.value == "") return alert("아이디를 입력해주세요");
    if (psw.value == "") return alert("비밀번호를 입력해주세요.");
    if (checkedNickname.value == "") return alert("닉네임을 확인해주세요.");
    if (address.value == "") return alert("주소를 입력해주세요");
    // 승인코드 입력이 빈칸이거나 , 승인여부
    if (codeBox.value == "" || auth_code == false) return alert("이메일 인증을 완료해주세요.");
    if (accept_box.checked == false) return alert("개인정보 제공에 동의 해주세요.");

    btn_register.addEventListener("click", e => {
        e.preventDefault();
        if (auth_code == true) {
            auth_code = false; // 회원가입을 했으므로 다시 인증받게 이메일 인증 false (뒤로가기 악용 방지)
            createUser.submit();
        }
    })


}

function btnCheckCode() { // 승인완료 코드
    let data = codeBox.value;

    if (emailcode == data) { // 승인완료된다면
        codeInfo.value = "완료";
        codeInfo.style.color = "red";

        codeBox.style.display = "none"; // 코드 입력칸 숨기기
        resendcodeBtn.style.display = "none" //승인코드 다시 받기 숨기기
        checkCodeBtn.style.display = "none"; // 입력완료버튼 숨기기
        codeTimer.style.display = "none";  // 시간타이머 숨기기

        emailFront.disabled = true; //이메일 앞부분 비활성화
        selectEmail.disabled = true; //이메일 뒷부분 비활성화
        directEmail.disabled = true; // 이메일 직접입력하는 칸 비활성화
        clearInterval(timer); //타이머 끄기
        auth_code = true; // 승인코드 완료 여부
        checkEmailReg.value = "checked";


        emailcode.value = ""; // 서버로 부터 받은 코드 초기화
    } else {
        codeInfo.value = "실패";
        codeInfo.style.color = "blue";
    }

}
function sendCode() { //승인코드 고객께 보내기
    alert(`${user_email.value} 이메일로 승인코드를 보냈습니다.`);
    const data = { receiverEmail: user_email.value };
    fetch('/v1/mail', {
        method: 'post',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    })
        .then((result) => result.json())
        .then((result) => {
            emailcode = result.randcode;
        })
        .catch((err) => alert('알맞지 않은 인증 메일입니다.'));
}
/** 닉네임 중복 실시간 체크 **/
async function checkNickname() {

    let nickname_v = nickname.value;

    if (nickname_v != "") {
        let check = await fetch(`/v1/checknickname/${nickname_v}`)
        let checkNickname = await check.json();
        let nicknameInfo = document.querySelector("#nicknameInfo");


        if (checkNickname.msg == "ok") {
            nicknameInfo.style.color = "blue"
            info = "가능";
            checkedNickname.value = "Good";
        }
        else {
            nicknameInfo.style.color = "red"
            info = "불가능"
            checkedNickname.value = "";
        }
    } else { // 빈칸이면 닉네임 중복여부 알림이도 빈칸
        info = "";
        checkedNickname.value = "";
    }
    nicknameInfo.value = info;
}
