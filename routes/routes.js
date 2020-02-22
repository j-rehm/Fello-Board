const bcrypt = require('bcrypt-nodejs');
const config = require('../config');
const fetch = require('node-fetch');

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
    
}

exports.home = (req, res) => {
    res.render('home', {
        config
    });
}
