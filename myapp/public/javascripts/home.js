btn_signin = document.getElementById('btn_signin');
btn_signout = document.getElementById('btn_signout');
let write = document.getElementById('write');
let mypage = document.getElementById('mypage');
let token_form = document.getElementById('token_form'); //토큰 보내는 form
let input_token = document.getElementById('input_token'); // 토큰 보내는 input 

write.addEventListener('click', event =>{
    token_form.action = `/v2/write?_method=GET`
    input_token.value = token;
    token_form.submit();
});

mypage.addEventListener('click', async event => {
    if(token == ""){
        alert("로그인 하세요");
        location.href="/v2/login";
        return;
    }
    let name = await Post_body("/v1/getnickname?_method=GET",{data:token});
    token_form.action = `/v3/board-mypage/${name.nickname}?_method=GET`
    input_token.value = token;
    token_form.submit();
})

if (token) { // 쿠키에 토큰이 있다면 // <로그인 상태>
    btn_signout.style.display = 'block'; // 로그아웃 버튼 활성화
    btn_signin.style.display = 'none'; // 로그인 버튼 비활성화
} else { // <로그인이 안된 상태>
    btn_signin.style.display = 'block'; // 로그인 버튼 활성화
    btn_signout.style.display = 'none'; // 로그아웃 버튼 비활성화
}
console.log(input_board_state.value);
