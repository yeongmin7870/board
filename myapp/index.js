const express = require('express');
const app = express();
const port = 3000;
let bodyparser = require('body-parser');
let cookieParser = require('cookie-parser');

const userRouter = require('./routes/userroute');
const viewRouter = require('./routes/viewroute')
const cookieRouter = require('./routes/cookieroute');

app.use(cookieParser());
app.use(bodyparser.urlencoded({ extended: false }));
app.use(bodyparser.json());
app.use(express.json());
app.use(express.static('public'));
app.use('/v1', userRouter);
app.use('/v2', viewRouter);
app.use('/cookies', cookieRouter);

app.set('view engine', 'ejs');
app.set('views', './views');

app.listen(port, () => {
    console.log(`http://localhost:${port}/v2`);
});
