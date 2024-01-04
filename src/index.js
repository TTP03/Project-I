const express = require('express');
const path = require('path');
const hbs = require('express-handlebars');
const morgan = require('morgan');
const port = 3000;
const app = express();
const route = require('./routes');
// http logger
app.use(morgan('combined'));

app.use(express.static(path.join(__dirname, 'public')));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

route(app);
// Template handlebars
app.engine(
    'hbs',
    hbs.engine({
        extname: '.hbs',
        helpers: {
            sum: (a, b) => a + b,
            mul: (a, b) => a * b,
        },
    }),
);
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'resources/views'));


console.log(path.join(__dirname, 'resources/views'));



app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
