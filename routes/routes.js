const bcrypt = require('bcrypt-nodejs');
const config = require('../config');
const fetch = require('node-fetch');
const mongoose = require('mongoose');

// Begin Mongo stuff
mongoose.Promise = global.Promise;
mongoose.connect('mongodb+srv://Admin:AdminPass@felloboard-gbrvh.mongodb.net/data?retryWrites=true&w=majority', {useNewUrlParser: true, useUnifiedTopology: true});

const mdb = mongoose.connection;
mdb.on('error', console.error.bind(console, 'connection error:'));
mdb.once('open', callback => {
});

// var userAccountSchema = mongoose.Schema({
//     fullName: String,
//     username: String,
//     hashedPassword: String
// });
// var UserAccount = mongoose.model('user_accounts', userAccountSchema);

var UserAccount = mongoose.model('user_accounts', mongoose.Schema({
    full_name: String,
    username: String,
    hashed_password: String
}));
// End Mongo stuff

exports.index = (req, res) => {
    res.render('index', {
        config
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
        config
    });
}

exports.parseCreateData = (req, res) => {
    bcrypt.hash(req.body.password, null, null, (err, hashed_password) => {
        createAccount(req.body.full_name, req.body.username, hashed_password);
        res.redirect('/');
    });
}

exports.home = (req, res) => {
    res.render('home', {
        config
    });
}

// Helper methods
const createAccount = (full_name, username, hashed_password) => {
    console.log(`${full_name}, ${username}, ${hashed_password}`)
    var userAccount = new UserAccount({
        full_name,
        username,
        hashed_password
    });
    userAccount.save((err, account) => {
        if (err) return console.error(err);
    });
};