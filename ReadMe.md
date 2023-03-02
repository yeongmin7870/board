 # :books: 전공책 싸게 사자 

     "졸업 후 자리만 차지하고 보지도 않는 '전공 책', 같은 학교 후배들에게 '중고'로 파는 것 어떠신가요?"

> :cd: URL : http://yeongmin.cafe24app.com/v2/home/0

> 테스트 계정
>>ID : test123 <br>
>>PASSWORDS : test123
 
## :bookmark: 1. 제작기간 & 참여 인원
>- 2022 년 12 월 21일 ~ 2033 년 2 월 22일
>- 개인 프로젝트

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

> 이 웹사이트의 핵심 기능은 학교와 전공별로 게시글을 '검색'할 수 있다는 것이 핵심입니다,   전국에  어떠한 대학이라도 어떤 학과가 있는지 선택할 수 있게 해주며,
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

> :pushpin: 채팅 (미완성)

</details>

<details>
<summary>기능설명 보기</summary>

### :pushpin: 4.1 전체 흐름
<img src="https://user-images.githubusercontent.com/73753121/220662399-039f30e4-dbe6-409e-88aa-f43a41a6e2dd.png">

### :pushpin: 4.2 학과 정보 요청 
[:flashlight: 처리함수 코드확인](https://github.com/yeongmin7870/board/blob/49a91f5223f271b3e5e49c82aad1ebc63725d7a8/myapp/controller/UniversityController.js#L5)
[:flashlight: 공공데이터 요청 함수 코드확인](https://github.com/yeongmin7870/board/blob/97b3ccc933757612476406029a3afc708c4d6401/myapp/models/university.js#L4)

> 공공데이터 api를 요청할 때 async, await 문법을 사용해서 동기 처리 방식을 사용했습니다.
> 사용자가 대학명을 입력하고 '학과'를 요청할 때, 서버는 공공데이터 사이트 api를 요청합니다.
> 먼저 현재 데이터 총수를 가져오고 (데이터 총수/7300) 값을 올림 한 값으로
> 즉, 총페이지수만큼 api를 요청합니다,
> 그리고 가져온 데이터를 전처리하면서 배열에 모두 담아 응답합니다.

### :pushpin: 4.3 이메일 인증 요청

[:flashlight: 이메일 인증 함수 코드확인](https://github.com/yeongmin7870/board/blob/97b3ccc933757612476406029a3afc708c4d6401/myapp/controller/UserController.js#L124)
[:flashlight: SMTP 서버에 요청 코드확인](https://github.com/yeongmin7870/board/blob/97b3ccc933757612476406029a3afc708c4d6401/myapp/modules/mail.js#L6)

> 이메일을 요청받으면 승인코드 랜덤 6자리를 만들고
> Gmail SMTP 전송 수단을 이용해서 이용자에게 메일을 전송합니다.

### :pushpin: 4.4 유저 비밀번호 저장방식

[:flashlight: 암호화를 사용한 회원가입 함수 코드확인](https://github.com/yeongmin7870/board/blob/97b3ccc933757612476406029a3afc708c4d6401/myapp/controller/UserController.js#L87)
[:flashlight: 암호화 방식 코드확인](https://github.com/yeongmin7870/board/blob/97b3ccc933757612476406029a3afc708c4d6401/myapp/modules/crypto.js#L16)

> 기존 비밀번호 문자열에 새로운 문자열을 붙여
> sha512 알고리즘으로, 9921번 리터럴하고 64길이를 만들어
> 데이터베이스에 저장했습니다.

### :pushpin: 4.4 이미지 업로드 기능

[:flashlight: multer 코드 보기](https://github.com/yeongmin7870/board/blob/df4768c9928e718f6031fbf0402c243ccaf2b651/myapp/middlewares/multer.js#L6)

> 서버에 이미지를 업로드할 때 multer 모듈을
> 사용했습니다.

### :pushpin: 4.5 새로고침 없이 부드러운 댓글 작성

[:flashlight: 댓글 작성 코드 보기](https://github.com/yeongmin7870/board/blob/94f68de63e0c11095071b4be1ca2776e4761ecb0/myapp/public/javascripts/board.js#L122)

> 새로고침 없이 부드럽게 댓글 작성을 구현하고 싶었습니다.<br>
> async fetch 문법을 통해서 데이터를 가져오고,
> 요소를 추가해줌으로써 부드럽게 만들었습니다.

### :pushpin: 4.6 조합 가능한 검색 기능

[:flashlight: 검색기능 코드 보기](https://github.com/yeongmin7870/board/blob/2b69a349245d8ce5e52aa4358524e33c9d11ab2f/myapp/modules/home_search.js#L67)

> 학교명, 학과, 제목, 종류, 닉네임을 자유롭게 조합해서 검색할 수 있습니다.

### :pushpin: 4.6 페이징 기능

[:flashlight: 페이징 처리 controller 함수 코드 보기](https://github.com/yeongmin7870/board/blob/94f68de63e0c11095071b4be1ca2776e4761ecb0/myapp/controller/BoardController.js#L46)
[:flashlight: 페이징 처리 함수 코드 보기](https://github.com/yeongmin7870/board/blob/94f68de63e0c11095071b4be1ca2776e4761ecb0/myapp/modules/page.js#L14)

> 페이지당 선택해서 보기 편하게 페이징 처리를 구현했습니다.
> 메인페이지, 댓글, 마이페이지가 같은 함수를 사용할 수 있게 구현했습니다.

</details>

## :bookmark: 5. Trouble Shooting
---

### :pushpin: 5.1 MySQL Character set 오류

<details>
    <summary>자세히 보기</summary>

    ERROR 3780 (HY000): Referencing column 'chat_room_user_id' and referenced column 'user_id' in foreign key constraint 'chat_room_ibfk_1' are incompatible.

> 채팅 방 유저 아이디를 유저아이디와 제약 걸어 foreign key를 설정하려고 했는데, 이러한 에러가 발생했습니다.<br>
> 처음에는 서로 타입이 맞지 않는지 확인하였지만 동일 에러 발생했습니다.<br>
>  https://stackoverflow.com/questions/21526055/mysql-cannot-create-foreign-key-constraint 사이트에서<br>
> character set이 서로 맞지 않으면 오류가 날 수 있다는 것을 발견했고<br>
> 과거 user 테이블을 만들 때 character set을 utf8로 설정했던 것이 기억 났고
> chat_room_user_id 를 uf8 로 설정했더니 해결되었습니다.
</details>

### :pushpin: 5.2 MySQL Bad handshake

<details>
    <summary>자세히 보기</summary>

    ERROR 1043 (08S01): Bad handshake

> local에 있던 DB sql 파일을 cafe24 DB에 import 하려고 했는데 저런 에러가 났습니다.<br>
> 확인해보니 로컬, cafe24 DB가 서로 버전이 달라서, db 접속 자체가 안됐습니다.<br>
> 맥 mysql 버전을 낮추기에는 cafe24 버전이 너무 구버전이라 이후에 다른 개발할 때 다시
> 버전을 올려야 돼서 번거로웠고, putty를 설치해서 접속을 시도했습니다.

    Unknown character set: ‘uft8mb3’

> 접속은 되었지만 sql 파일을 import 할 때 저런에러가 나왔고 찾아보니
> mysql5 버전에서는 uft8mb3가 없었습니다.<br>
> 그래서 utf8로 변경하고 다시 import 시켰더니 정상적으로 작동했습니다.

</details>

### :pushpin: 5.3 fetch 통신 후 가져온 값 'undefined'

<details>
    <summary>자세히 보기</summary>

[:flashlight: json 파싱 코드 보기](https://github.com/yeongmin7870/board/blob/d0546a73ea2c7081dafdb26c028d823448c76af0/myapp/public/javascripts/fetch.js#L20)

    1 fetch('http://example.com/movies.json')
    2 .then((response) => response.json())
    3 .then((data) => console.log(data));

> 2번째 코드만 적고 HTTP 응답 전체를 나타내는 객체만 받으면서, 인증코드를 추출하려고 해, 
> undefined가 나왔습니다.<br>
> JSON 본문 내용을 추출하기 위해서는 응답 본문을 json()으로 파싱해야 했습니다.

</details>

### :pushpin: 5.4 HTML Form 태그 method 한계

<details>
    <summary>자세히 보기</summary>

[:flashlight: method-override 활용 코드 보기](https://github.com/yeongmin7870/board/blob/d0546a73ea2c7081dafdb26c028d823448c76af0/myapp/public/javascripts/board.js#L52)

    npm install method-override

> 저는 서버를 REST API로 설계했습니다.<br>
> 이때, get 이지만 body로 값을 보내줘야 할 때가 있는데,
> HTML Form 태그는 body 값을 보내줄 때는 post로 해야했습니다.<br>
> 또한 delete와 put은 지원하지 않기 때문에, 이를 해결 할 모듈을 찾기
> 시작했고, method-override를 이용해 해결했습니다.

</details>


### :pushpin: 5.5 페이지를 랜더링 하면 채팅방 메시지가 중첩되어서 보내지는 현상
<details>
    <summary>자세히 보기</summary>

[:flashlight: 중첩 메시지 해결 코드 보기](https://github.com/yeongmin7870/board/blob/d0546a73ea2c7081dafdb26c028d823448c76af0/myapp/web.js#L41)

> 채팅메시지를 보내고 나갔다가 다시 들어오거나, 새로고침하고 보내면, 메시지가 
> 중첩되면서 보내지는 문제가 있었습니다.<br>
> 처음에는 채팅방을 떠날 때 소켓연결 끊기를 해주지 않은게 원인 일 거라고 생각했습니다,
> 그래서 서버쪽에

    socket.on('disconnect', () => {});

>클라이언트

    socket.emit('disconnect');

>을 호출했는데 

    socket.js:199 Uncaught Error: "disconnect" is a reserved event name
    at Socket.emit (socket.js:199:19)
    at exitRoom (chatting?room=room1:142:20)
    at HTMLButtonElement.onclick (chatting?room=room1:50:42)

> 이런 문제가 발생했고 socket.io 문서를 찾아보니 disconnect는 소켓 통신이 끊어지기만
> 해도 disconnect 이벤트가 발생한다고 알게되었습니다.<br>
> 그러나 이 에러를 고쳐도 원래 문제였던 채팅 충첩 보내짐은 해결되지 못했습니다.<br>
> 소켓통신을 다시 공부해보니 소켓은 서버와 클라이언트 간에 양방향 통신인데,
> 저는 채팅방 랜더링해주는 URI 안에다가 소켓 통신 코드를 집어넣고 있었습니다.<br>
> 그러니 당연히 채팅방을 랜더링 할 때마다 서버에 소켓 응답 대기 또한 늘어나고 있던 것이였습니다.<br>
> 코드를 서버 web.js(index.js) 파일에다가 넣고, 처음 서버가 시작될 때,
> 소켓통신을 최초 한 번만 시키게 했더니 문제가 해결되었습니다.<br>

</details>

### :pushpin: 5.6 Cafe24 경로 문제

<details>
    <summary>자세히 보기</summary>

[:flashlight: 경로 해결 코드 보기](https://github.com/yeongmin7870/board/blob/d0546a73ea2c7081dafdb26c028d823448c76af0/myapp/middlewares/multer.js#L17)

> 로컬 서버에서는 상대경로를 썼다가 cafe24로 넘어오면서  
> '이미지 업로드' 경로 문제가 생기기 시작했습니다.<br>
> 그래서 path 모듈중에 join() 메소드를 사용했고,
> 같은 폴더에 있을 때는 쉽지만 상위 폴더에서 다른 폴더로
> 가야할 때는 __dirname 변수를 쓰지 못하고 결국엔 
> 경로 로그를 찍어봐야 했습니다.<br>
> 더 좋은 방법이 없을까 고민하다가 같은 모듈에 resovle()
> 라는 메소드도 있었고, 상대경로도 사용할 수 있다는 것을 알고
> 이를 적용하고 해결했습니다.
</details>

### :pushpin: 5.7 onclick 이벤트 os 문제

<details>
    <summary>자세히 보기</summary>

[:flashlight: os 문제 해결 코드 보기](https://github.com/yeongmin7870/board/blob/94f68de63e0c11095071b4be1ca2776e4761ecb0/myapp/public/javascripts/writeboard.js#L128)

>윈도우는 학과 select 에서 option 클릭이 되지 않지만, 
>맥이나 핸드폰은 클릭이 되는 호환성 문제가 있었습니다.<br>
>처음 오류를 접했을때, 크롬이나 서버에서 어떠한 오류도 뜨지 않고 
>구글링을 해봐도 전혀 나오지 않아 당황했습니다.<br>
>디버깅을 해본 결과, 서버 문제는 아니었고 자바스크립트 os호환 문제 같았습니다.<br> 
>html ,css를 바꿔봐도 전혀 문제가 없었고 js 알고리즘이 잘못된건가 싶어서,
>원래는 innerhtml 이였지만 appenchild() 문법으로 변경했지만 해결되지 못했습니다.<br>
>문득 그저 저의 생각일 뿐이지만, "option 태그 자체가 클릭인데 내가 select 태그에다가 클릭이벤트를 달면,
>두 태그의 클릭 이벤트가 충돌이 되는게 아닐까"라는 생각이 들었습니다.<br> 
>그래서 select 태그에다가 클릭 이벤트 대신에 mousedown() 이벤트로 바꿔줬더니 window 에서도 정상적으로 작동했습니다.
</details>

### :pushpin: 5.8 for 문을 이용한 pop시 정상적인 결과가 나오지 않는 문제
<details>
    <summary>자세히 보기</summary>

[:flashlight: pop 해결 코드 보기](https://github.com/yeongmin7870/board/blob/d0546a73ea2c7081dafdb26c028d823448c76af0/myapp/public/javascripts/writeboard.js#L64)

    let ex = []
    for(let i=0; i < ex.length; i++) ex.pop();

>정상적으로는 배열안에 값들이 모두 없어져야 하는데 값들이 남아있는 문제가 생겨 고민하다가,
> pop 할 때 당연히 해당 배열의 길이가 줄어들 것이고
> 그 배열의 길이로 for문을 돌렸으니, 정상적인 결과가 나오지 못했다는 것을 깨달았습니다.<br>
> 다른 변수에 해당 배열을 복제 해주고, 새로운 변수에 길이를 활용해서 해결했습니다.

</details>

### :pushpin: 5.9 공공데이터를 가져올때 너무 오래 걸리는 문제
<details>
    <summary>자세히 보기</summary>

[:flashlight: 오래걸리는 문제 해결 코드 보기](https://github.com/yeongmin7870/board/blob/d0546a73ea2c7081dafdb26c028d823448c76af0/myapp/controller/UniversityController.js#L2)

>공공데이터 api 구조가 페이지, 페이지당 데이터수 값을 url 쿼리로 받고있었고,
>데이터를 나눠 받아서 배열에 저장해준 다음에 보내주는 방식을 선택했습니다.<br>
>그러나 확실히 나눠서 받아오니까 저의 서버 처리가 너무 느렸습니다.<br>
>데이터베이스를 썼으면 나눠서 받는 api 보다는 빨라서 좋았겠지만,
>만약 공공데이터 홈페이지 데이터들을 업데이트 해준다면,
>디비에도 일일이 값을 업데이트 해야하는 번거로움이 있었습니다.<br>
>그래서, 데이터베이스를 쓰지않고 받아오는 시간을 최대한 단축시켜보고 싶었습니다.<br>
>기존에는 4000개씩 나눠서 받던 것을
>7300개 씩으로 늘렸습니다.<br>
>하필 7300 개인 이유는,
>대략 7300 이후 부터는 공공 api 에서 데이터를 못 받아오게 막아놓았습니다.<br>
>확실히 3300 개씩 데이터를 한번에 더 받아오면서, 배열에 저장하니까
아주 조금 빨라졌습니다.<br>

>또한, res.send(university_array) 로 보내줬던 변수를 
>지역변수가 아닌 전역변수로 만들고,
>이전에 저장해뒀던 값이 있다면 바로 보내주는 식으로 만드니까,
>서버에서는 최초 한 번만 공공데이터와 통신하면 되고 이후로는,
>공공데이터 통신 없이 바로 데이터를 보내주면 되니, 느렸던 문제가 해결되었습니다.

</details>

## :bookmark: 6. 느낀 점
---
> 같은 학교 학생들이 전공책을 중고로 팔 수 있는 사이트가
> 활성화 됐으면 좋겠다 라는 생각을 가졌고 '전공책 싸게 사자' 라는 프로젝트를 만들었습니다.<br>
> 혼자 모든 걸 만들기에는 어려워 보였지만 시도했고 덕분에 웹페이지가 어떤 과정을 거쳐서 기능을 
> 하는지 몸소 구현 할 수 있는 좋은 경험이였습니다.<br>
> node.js에서 express는 제가 필요한 기능들이 많이 있어서 매력적이라고 생각했고 다음번에는
> socket.io 를 이용해서 채팅 기능을 완성시켜야 겠다고 생각했습니다.



