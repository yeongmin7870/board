 # :books: 전공책 싸게 사자 

     "졸업 후 자리만 차지하고 보지도 않는 '전공책', 같은 학교 후배들에게 '중고'로 파는 것 어떠신가요?"

> :cd: URL : http://yeongmin.cafe24app.com/v2/home/0
 
## :bookmark: 1. 제작기간 & 참여 인원
>- 2022 년 12 월 21일 ~ 2033 년 2 월 22일
>- 개인프로젝트

## :bookmark: 2. 사용 기술

>### 2-1. 공통
>- Node.js(18.12.0)
>>- Node.js_cafe24(14)
>- Express(4.18.2)
>- Javascript(ECMAScript 2018)

>### 2-1. Front
>- ejs (3.1.8)

>### 2-2. Back
>- MySQL(8.0.32 for macos13.0 on arm64)
>>- MySQL_cafe24(Distrib 5.1.61, for unknown-linux-gnu (x86_64))
>- jsonwebtoken(9.0.0)
>- multer(1.4.5-lts.1)
>- nodemailer(6.9.0)
>- socket.io(4.5.4)
>- nodemon(2.0.20)
>- winston(3.8.2)

## :bookmark: 3. ERD 설계
---
<img src="https://user-images.githubusercontent.com/73753121/220611258-4cc63f5d-ee76-4306-89d5-07123fc17f0c.png">

## :bookmark: 4. 핵심 기능
---

> 이 웹사이트의 핵심 기능은 학교 및 전공별로 게시글을 '검색'할 수 있다는 것이 핵심입니다,   전국에  어떠한 대학이라도 어떤 학과가 있는지 선택할 수 있게 해주며,
이용자는 게시글을 확인하고 '중고 전공책'을 거래할 수 있습니다.
<details>
<summary>기능들 한 눈에 보기</summary>

> :pushpin: 검색
>>- 공공데이터(한국대학교육협의회_대학알리미 대학별 학과정보) 활용

> :pushpin: 회원가입
>>- 이메일 인증
>>- 닉네임 중복 확인

> :pushpin: 로그인
>>- 토큰 발급
>>- 단방향 암호화

> :pushpin: 게시물
>>- 작성
>>- 수정
>>- 삭제
>>- 상태
>>>1. 판매
>>>2. 예약중
>>>3. 판매완료

> :pushpin: 마이페이지
>>- 프로필 수정
>>- 소개글 수정

> :pushpin: 댓글
>>- 작성
>>- 삭제

</details>

<details>
<summary>기능설명 보기</summary>

### :pushpin: 4.1 전체 흐름
<img src="https://user-images.githubusercontent.com/73753121/220662399-039f30e4-dbe6-409e-88aa-f43a41a6e2dd.png">

### :pushpin: 4.2 학과 정보 요청 
[:flashlight: 처리함수 코드확인](https://github.com/yeongmin7870/board/blob/49a91f5223f271b3e5e49c82aad1ebc63725d7a8/myapp/controller/UniversityController.js#L5)
[:flashlight: 공공데이터 요청 함수 코드확인](https://github.com/yeongmin7870/board/blob/97b3ccc933757612476406029a3afc708c4d6401/myapp/models/university.js#L4)

> 공공데이터 api를 요청할때 async, await 문법을 사용해서 동기처리 방식을 사용했습니다.
> 유저가 대학명을 입력하고 '학과'를 요청할때, 서버는 공공데이터 사이트 api를 요청합니다.
> 먼저 현재 총 데이터 수를 가져오고 (총데이터수/7300) 값을 올림한 값으로
> 즉, 총페이지수 만큼 api를 요청합니다,
> 그리고 가져온 데이터를 전처리 하면서 배열에 모두 담아 응답합니다.

### :pushpin: 4.3 이메일 인증 요청

[:flashlight: 이메일 인증 함수 코드확인](https://github.com/yeongmin7870/board/blob/97b3ccc933757612476406029a3afc708c4d6401/myapp/controller/UserController.js#L124)
[:flashlight: SMTP 서버에 요청 코드확인](https://github.com/yeongmin7870/board/blob/97b3ccc933757612476406029a3afc708c4d6401/myapp/modules/mail.js#L6)

> 이메일을 요청받으면 승인코드 랜덤 6자리를 만들고
> Gmail SMTP 전송 수단을 이용해서 이용자에게 메일을 전송합니다.

### :pushpin: 4.4 유저 비밀번호 저장방식

[:flashlight: 암호화를 사용한 회원가입 함수 코드확인](https://github.com/yeongmin7870/board/blob/97b3ccc933757612476406029a3afc708c4d6401/myapp/controller/UserController.js#L87)
[:flashlight: 암호화 방식 코드확인](https://github.com/yeongmin7870/board/blob/97b3ccc933757612476406029a3afc708c4d6401/myapp/modules/crypto.js#L16)

> 기존 비밀번호 문자열에 새로운 문자열을 붙여서
> sha512 알고리즘으로, 9921번 리터럴하고 64길이를 만들어서
> 데이터베이스에 저장했습니다.

</details>

## :bookmark: 5. Trouble Shooting
---

### :pushpin: 5.1 MySQL Character set 오류

<details>
    <summary>자세히 보기</summary>

    ERROR 3780 (HY000): Referencing column 'chat_room_user_id' and referenced column 'user_id' in foreign key constraint 'chat_room_ibfk_1' are incompatible.

> 채팅 방 유저 아이디를 유저아이디와 제약을 걸어 foreign key를 설정하려고 했는데 이러한 에러가 발생했습니다.<br>
> 처음에는 서로 타입이 맞지 않는지 확인하였지만 동일 에러 발생,
>  https://stackoverflow.com/questions/21526055/mysql-cannot-create-foreign-key-constraint 사이트에서<br>
> character set이 서로 맞지 않으면 오류가 날 수 있다는 것을 발견했고<br>
> 과거 user 테이블을 만들때 character set을 utf8로 설정했던 것이 기억 났고
> chat_room_user_id 를 uf8 로 설정했더니 해결되었습니다.
</details>

### :pushpin: 5.2 MySQL Bad handshake

<details>
    <summary>자세히 보기</summary>

    ERROR 1043 (08S01): Bad handshake

> local에 있던 DB sql 파일을 cafe24 DB에 import 하려고 했는데 저런 에러가 났습니다.<br>
> 확인해보니 로컬, cafe24 DB가 서로 버전이 달라서, db 접속 자체가 안됐습니다.<br>
> 맥 mysql 버전을 낮추기에는 cafe24 버전이 너무 구버전이라 이후에 다른 개발할때 다시
> 버전을 올려야 돼서 번거로웠고, putty를 설치해서 접속을 시도 했습니다.

    Unknown character set: ‘uft8mb3’

> 접속은 되었지만 sql 파일을 import 할때 저런에러가 나왔고 찾아보니
> mysql5 버전에서는 uft8mb3 가 없었습니다.<br>
> 그래서 utf8 로 변경하고 다시 import 시켰더니 정상적으로 작동했습니다.

</details>

### :pushpin: 5.3 fetch 통신 후 가져온 값 'undefined'

<details>
    <summary>자세히 보기</summary>

    1 fetch('http://example.com/movies.json')
    2 .then((response) => response.json())
    3 .then((data) => console.log(data));

> 2번째 코드만 적고 HTTP 응답 전체를 나타내는 객체만 받으면서, 인증코드를 추출하려고 해 
> undefined가 나왔습니다.<br>
> JSON 본문 내용을 추출하기 위해서는 응답 본문을 json()으로 파싱해야 했습니다.

</details>

### :pushpin: 5.4 HTML Form 태그 method 한계

<details>
    <summary>자세히 보기</summary>

    npm install method-override

> 저는 서버를 REST API 로 설계를 했습니다.<br>
> 이때, get 이지만 body로 값을 보내줘야 할때가 있는데,
> HTML Form 태그는 body 값을 보내줄때는 post로 해야 했습니다.<br>
> 또한 delete 와 put은 지원하지 않기때문에, 이를 해결할 모듈을 찾기
> 시작했고 method-override를 이용해 해결했습니다.

</details>


### :pushpin: 5.5 페이지를 랜더링 하면 채팅방 메시지가 중첩되어서 보내지는 현상
<details>
    <summary>자세히 보기</summary>

> 채팅메시지를 보내고 나갔다가 다시 들어오거나, 새로고침하고 보내면 메시지가 
> 중첩되면서 보내지는 문제가 있었습니다.<br>
> 처음에는 채팅방을 떠날때 소켓 연결 끊기를 해주지 않은게 원인일 거라고 생각했습니다,
> 그래서 서버쪽에

    socket.on('disconnect', () => {});

>클라이언트

    socket.emit('disconnect');

>을 호출했는데 

    socket.js:199 Uncaught Error: "disconnect" is a reserved event name
    at Socket.emit (socket.js:199:19)
    at exitRoom (chatting?room=room1:142:20)
    at HTMLButtonElement.onclick (chatting?room=room1:50:42)

> 이런 문제가 발생했고 socket.io 문서를 찾아보니 disconnect 는 소켓 통신이 끊어지기만
> 해도 disconnect 이벤트가 발생한다고 알게되었습니다.<br>
> 그러나 이 에러를 고쳐도 원래 문제였던 채팅 충첩 보내짐은 해결되지 못했습니다.<br>
> 소켓통신을 다시 공부해보니 소켓은 서버와 클라이언트 간에 양방향 통신인데,
> 저는 채팅방 랜더링해주는 URI 안에다가 소켓 통신 코드를 집어넣고 있었습니다.<br>
> 그러니 당연히 채팅방을 랜더링할때마다 서버에 소켓 응답 대기 또한 늘어나고 있던 것이였습니다.<br>
> 코드를 서버 web.js(index.js) 파일에다가 넣고, 처음 서버가 시작될때,
> 소켓통신을 최초 한번만 시키게 했더니 문제가 해결되었습니다.<br>

</details>

## :bookmark: 6. 느낀 점
---
> 당근마켓 처럼 같은 학교 학생들이 전공책을 중고로 팔 수 있는 사이트가<br>
> 활성화 되었으면 좋겠다라는 생각을 가졌고 '전공책 싸게 사자' 라는 프로젝트를 만들었습니다.<br>
> 모듈과 원리를 공부할떄마다 그동안 제가 언어와 프레임워크에만 치중했다라는 사실을 깨달았습니다, 중요한 것은 적재적소에 어떤 모듈, 언어, 프레임워크를 가져다 쓸건지를 판단하는 것이 중요하다라는 것을 알았습니다. <br>
> 많이 고민했지만 너무 재밌었고 지금은 혼자 프로젝트를 했지만 협업을 하고 대화를 해가면서 좋은 코드와 저 자신이 끊임없이 발전 하고싶다라는 욕구가 계속해서 들었습니다.<br>



