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

var UserAccount = mongoose.model('user_accounts', mongoose.Schema({
    full_name: String,
    username: String,
    hashed_password: String
}));
// End Mongo stuff

exports.index = (req, res) => {
    destroySession(req);
    res.render('index', {
        config,
        "userInvalid": false
    });
}

exports.validateLogin = (req, res) => {
    UserAccount.findOne({"username": req.body.username}, (err, account) => {
        if (!account) {
            res.render('index', {
                config,
                "userInvalid": true
            });
        } else {
            bcrypt.compare(req.body.password, account.hashed_password, (err2, isValid) => {
                if (isValid) {
                    createSession(req);
                    res.redirect('/home');
                } else {
                    res.render('index', {
                        config,
                        "userInvalid": true
                    });
                }
            });
        }
    });
}

exports.board = (req, res) => {
    res.render('board');
}

exports.create = (req, res) => {
    res.render('create', {
        config
    });
}

exports.edit = (req, res) => {
    res.render('edit', {
        config
    });
}

exports.parseCreateData = (req, res) => {
    UserAccount.findOne({"username": req.body.username}, (err, account) => {
        if(!account) {
            bcrypt.hash(req.body.password, null, null, (err, hashed_password) => {
                createAccount(req.body.full_name, req.body.username, hashed_password);
                res.redirect('/');
            });
        } else {
            console.log("Username is already taken!");
            res.render('create', {
                config, 
                "userTaken": true
            });
        }
    });
}

exports.home = (req, res) => {
    UserAccount.findOne({"username": req.session.user.username}, (err, account) => {
        res.render('home', {
            config,
            name: account.full_name
        });
    });
    // findAccount(req.session.user.username, (err, account) => {
    //     console.log(account);
    //     console.log(err);
    //     res.render('home', {
    //         config,
    //         name: account.full_name
    //     });
    // });
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

const createSession = req => {
    req.session.user = {
        username: req.body.username,
        isAuthenticated: true
    };
    // console.log(req.session);
};

const destroySession = req => {
    // console.log(req.session);
    if (req.session.user) {
        req.session.destroy();
    }
};

const findAccount = async (username, callback) => {
    UserAccount.findOne({"username": username}, (err, account) => {
        if (err) {
            console.log(err);
            return callback(new Error(`Could not find account '${username}'`));
        }
        return callback(account);
    });
}