const express = require('express');
const expressSession = require('express-session');
const pug = require('pug');
const bodyParser = require('body-parser');
const path = require('path');
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

// app.use(express.json());
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.use((req, res, next) => {
    res.sendData = data => {
        console.log(data);
    };
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
app.get('/login', routes.login);
app.post('/login', urlEncodedParser, routes.validateLogin);
app.get('/logout', routes.logout);
app.get('/create', routes.create);
app.post('/create', urlEncodedParser, routes.parseCreateData);
app.get('/welcome', checkAuth, routes.welcome);
app.get('/edit', checkAuth, routes.edit);
app.post('/edit', checkAuth, routes.updateUserData);


app.get('/board', checkAuth, routes.getBoardName);
app.post('/board', urlEncodedParser, routes.createBoard);
app.post('/updateBoard', urlEncodedParser, routes.parseBoardData);
app.get('/board/:id', checkAuth, routes.loadBoardFromId)

// app.get('/test/:x', routes.test);
app.get('/test', routes.test);

app.listen(3000);
