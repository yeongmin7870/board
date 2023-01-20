const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const cors = require('cors'); // cors - 클라이언트에서 ajax로 요청 시 CORS(다중 서버 접속) 지원
const port = process.env.PORT || 3000;

let bodyparser = require('body-parser');
let cookieParser = require('cookie-parser');
let session = require('express-session');
let MySQLStore = require('express-mysql-session')(session);
let methodOverride = require('method-override');

/*session을 사용하기 위한 mysql2*/
let mysql2 = require('mysql2/promise');
let options = require('./config/mysql2options.json')
let connection = mysql2.createPool(options);
let sessionStore = new MySQLStore({}, connection);

const userRouter = require('./routes/userroute');
const viewRouter = require('./routes/viewroute')
const cookieRouter = require('./routes/cookieroute');
const boardRouter = require('./routes/boardroute');
const chatfnc = require('./chat/chat');

app.use(session({
    key: 'session_cookie_name',
    secret: 'session_cookie_secret',
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        maxAge: 10000 * 5, //5분동안 인증코드 유효
    },
}));

app.use(cookieParser());
app.use(bodyparser.urlencoded({ extended: false }));
app.use(bodyparser.json());
app.use(express.json()); 
app.use(express.urlencoded( {extended : false } ));
app.use(express.static('public'));
app.use(methodOverride('_method'));

app.use('/v1', userRouter);
app.use('/v2', viewRouter);
app.use('/v3', boardRouter);

app.use(cors());

app.use('/cookies', cookieRouter);

app.set('view engine', 'ejs');
app.set('views', './views');
app.set('io', io) // 전역변수로 등록 

app.get('/chat', (req, res) => {
    res.render('chat');
});

chatfnc(app); // 채팅 함수 호출

http.listen(port, () => {
    console.log(`http://localhost:${port}/v2/home/0`);
});