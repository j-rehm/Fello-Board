const express = require('express');
const expressSession = require('express-session');
const pug = require('pug');
const bodyParser = require('body-parser');
const path = require('path');
const bcrypt = require('bcrypt-nodejs');
const routes = require('./routes/routes.js');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');

mongoose.connect('mongodb+srv://Admin:AdminPass@felloboard-gbrvh.mongodb.net/test?retryWrites=true&w=majority', {useNewUrlParser: true, useUnifiedTopology: true});

const app = express();

app.set('view engine', 'pug');
app.set('views', path.join(__dirname + '/views'));
app.use(express.static(path.join(__dirname + '/public')));
// app.use(cookieParser('login'));

app.get('/', routes.index);
app.post('/login', routes.validateLogin);
app.get('/test', routes.test);
app.get('/create', routes.create);
app.post('/create', routes.parseCreateData);
app.get('/home', routes.home);

app.listen(3000);