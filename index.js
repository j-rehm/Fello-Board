const express = require('express');
const expressSession = require('express-session');
const pug = require('pug');
const bodyParser = require('body-parser');
const path = require('path');
const bcrypt = require('bcrypt-nodejs');
const routes = require('./routes/routes.js');
const cookieParser = require('cookie-parser');

const app = express();
const urlEncodedParser = bodyParser.urlencoded({extended: false});

app.set('view engine', 'pug');
app.set('views', path.join(__dirname + '/views'));
app.use(express.static(path.join(__dirname + '/public')));
app.use(cookieParser('login'));

app.use(expressSession({
    secret: 'FelloBoardUserSessionPassword',
    saveUninitialized: true,
    resave: true
}));

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

const checkAuth = (req, res, next) => {
    if(req.session.user && req.session.user.isAuthenticated) {
        next();
    } else {
        res.redirect('/');
    }
};

// Routes
app.get('/', routes.index);
app.get('/board', routes.board);
app.post('/login', urlEncodedParser, routes.validateLogin);
app.get('/create', routes.create);
app.post('/create', urlEncodedParser, routes.parseCreateData);
app.get('/home', checkAuth, routes.home);
app.get('/edit', routes.edit);
app.get('/logout', routes.logout);

app.listen(3000);
