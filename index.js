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

// application/json content type (use JSON.Stringify())
app.use(express.json());

// plain/text content type
app.use(function(req, res, next){
    if (req.is('text/*')) {
      req.text = '';
      req.setEncoding('utf8');
      req.on('data', function(chunk){ req.text += chunk });
      req.on('end', next);
    } else {
      next();
    }
});

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
app.post('/login', urlEncodedParser, routes.validateLogin);
app.get('/create', routes.create);
app.post('/create', urlEncodedParser, routes.parseCreateData);
app.get('/home', checkAuth, routes.home);
app.get('/edit', checkAuth, routes.edit);

app.get('/board', checkAuth, routes.board);
app.post('/board', urlEncodedParser, routes.parseBoardData);
app.get('/board/:id', urlEncodedParser, routes.boardId)

app.get('/test/:x', routes.test);
// app.get('/test', routes.test);

app.listen(3000);
