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

### :pushpin: 4.2 학과 정보 요청 [:flashlight: 코드확인](https://github.com/yeongmin7870/board/blob/49a91f5223f271b3e5e49c82aad1ebc63725d7a8/myapp/controller/UniversityController.js#L5)

> 공공데이터 api를 요청할때 async, await 문법을 사용해서 동기처리 방식을 사용했습니다.
> 유저가 대학명을 입력하고 '학과'를 요청할때, 서버는 공공데이터 사이트 api를 요청합니다.
> 먼저 현재 총 데이터 수를 가져오고 (총데이터수/7300) 값을 올림한 값으로 몇번 api를 요청할지 구합니다,
> 그리고 가져온 데이터를 전처리하면서 배열에 모두 담아 응답합니다.



</details>

## :bookmark: 5. Trouble Shooting
---

## :bookmark: 6. 느낀 점
---



