const express = require('express');
const app = express();
const port = 3000;

const userRouter = require('./userroutes');
const viewRouter = require('./viewroutes')


app.use(express.static('public'));
app.use('/v1/user', userRouter);
app.use('/v2',viewRouter);

app.set('view engine','ejs');
app.set('views','./views');

app.listen(port, () => {
    console.log(`http://localhost:${port}/`);
});
