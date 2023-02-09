const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require('socket.io');
const io = new Server(server);

const port = process.env.PORT || 80;
const { logger } = require('./modules/logger');

let bodyparser = require('body-parser');
let cookieParser = require('cookie-parser');
let session = require('express-session');
let methodOverride = require('method-override');

const userRouter = require('./routes/userroute');
const viewRouter = require('./routes/viewroute')
const cookieRouter = require('./routes/cookieroute');
const boardRouter = require('./routes/boardroute');
const chatcontroller = require('./controller/ChatController');

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

app.use('/cookies', cookieRouter);

io.on('connection', (socket) => {
fdsfs
    socket.on('chat message', (msg) => {
        io.emit('chat message', msg);
    });
});

app.set('view engine', 'ejs');
app.set('views', './views');

server.listen(port, () => {
    logger.info(`http://localhost:${port}/v2/home/0 주소로 서버가 시작되었습니다.`);
});

