const express = require('express');
const app = express();
const port = 3000;

const indexRouter = require('./routes');
const viewRouter = require('./viewroutes')

app.use(express.static('public'));
app.use('/v1', indexRouter);
app.use('/v2',viewRouter);

app.set('view engine','ejs');
app.set('views','./views');

app.listen(port, () => {
    console.log(`http://localhost:${port}/`);
});
