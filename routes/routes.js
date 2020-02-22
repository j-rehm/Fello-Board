// Begin Mongo stuff
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
mongoose.connect('mongodb+srv://Admin:AdminPass@felloboard-gbrvh.mongodb.net/test?retryWrites=true&w=majority/data', {useNewUrlParser: true, useUnifiedTopology: true});

const mdb = mongoose.connection;
mdb.on('error', console.error.bind(console, 'connection error:'));
mdb.once('open', callback => {
});

var userAccountSchema = mongoose.Schema({
    fullName: String,
    username: String,
    hashedPassword: String
});

var UserAccount = mongoose.model('user_accounts', userAccountSchema);
// End Mongo stuff

exports.index = (req, res) => {
    res.render('index', {
        "title": "Login",
        "username": "Username: ",
        "password": "Password: ",
        "noAccount": "Don't have an account? Click here!"
    });
}

exports.validateLogin = (req, res) => {
    // TODO implement after accounts can be created
}

exports.test = (req, res) => {
    res.render('testDIV');
}

exports.create = (req, res) => {
    res.render('create', {
        "title": "Create Account",
        "username": "Username: ",
        "password": "Password: ",
        "fullName": "Full Name: "
    });
}

exports.parseCreateData = (req, res) => {
    res.redirect('/home');
}

exports.home = (req, res) => {
    res.render('home', {
        "title": "Home Page"
    });
}
