const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const cors = require('cors'); // cors - 클라이언트에서 ajax로 요청 시 CORS(다중 서버 접속) 지원
const port = process.env.PORT || 3000;
const { logger } = require('./modules/logger');

let bodyparser = require('body-parser');
let cookieParser = require('cookie-parser');
let session = require('express-session');
let methodOverride = require('method-override');

const userRouter = require('./routes/userroute');
const viewRouter = require('./routes/viewroute')
const cookieRouter = require('./routes/cookieroute');
const boardRouter = require('./routes/boardroute');
const chatfnc = require('./chat/chat');


app.use(cookieParser());
app.use(bodyparser.urlencoded({ extended: false }));
app.use(bodyparser.json());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
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
    logger.info(`http://localhost:${port}/v2/home/0 주소로 서버가 시작되었습니다.`);
});