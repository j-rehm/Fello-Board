const config = require('../config');
const fetch = require('node-fetch');
const bcrypt = require('bcrypt-nodejs');
const db = require('../database.js')

exports.index = (req, res) => {
    destroySession(req);
    res.render('index', {
        config,
        "userInvalid": false
    });
}

exports.validateLogin = (req, res) => {
    db.findAccount(req.body.username, (account) => {
        if (account) { // username matches
            bcrypt.compare(req.body.password, account.hashed_password, (err, isValid) => {
                if (isValid) { // password matches
                    createSession(req);
                    res.redirect('/home');
                } else { // password does not match
                    res.render('index', {
                        config,
                        "userInvalid": true
                    });
                }
            });
        } else { // username does not match
            res.render('index', {
                config,
                "userInvalid": true
            });
        }
    });
}

exports.create = (req, res) => {
    res.render('create', {
        config
    });
}

exports.logout = (req, res) => {
    res.redirect('/');
}

exports.parseCreateData = (req, res) => {
    db.findAccount(req.body.username, (account) => {
        if(!account) {
            bcrypt.hash(req.body.password, null, null, (err, hashed_password) => {
                db.createAccount(req.body.full_name, req.body.username, hashed_password);
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
    db.findAccount(req.session.user.username, (account) => {
        res.render('home', {
            config,
            name: account.full_name
        });
    });
}

exports.board = (req, res) => {
    res.render('board', {
        config
    });
}

exports.edit = (req, res) => {
    res.render('edit', {
        config
    });
}


// Helper methods
/*
    Express session
*/
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