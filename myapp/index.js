const express = require('express');
const app = express();
const port = 3000;
let bodyparser = require('body-parser');

const userRouter = require('./userroutes');
const viewRouter = require('./viewroutes')

app.use(bodyparser.urlencoded({extended:false}));
app.use(bodyparser.json());
app.use(express.json());
app.use(express.static('public'));
app.use('/v1', userRouter);
app.use('/v2',viewRouter);

app.set('view engine','ejs');
app.set('views','./views');

app.listen(port, () => {
    console.log(`http://localhost:${port}/`);
});
