const express = require('express');
const path = require('path');
const exphbs = require('express-handlebars');
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
const hbs = exphbs.create();
app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'resources/views'));


console.log(path.join(__dirname, 'resources/views'));



app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
