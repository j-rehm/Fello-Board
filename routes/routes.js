const config = require('../config');
const bcrypt = require('bcrypt-nodejs');
const db = require('../database.js');

exports.index = (req, res) => {
    res.render('index', {
        config,
        navBar: getNavBar(req)
    });
}

exports.login = (req, res) => {
    destroySession(req);
    res.render('login', {
        config,
        "userInvalid": false,
        navBar: getNavBar(req)
    });
}

exports.logout = (req, res) => {
    destroySession(req);
    res.redirect("/");
};

exports.validateLogin = (req, res) => {
    db.findAccount(req.body.username, (account) => {
        if (account) { // username matches
            bcrypt.compare(req.body.password, account.hashed_password, (err, isValid) => {
                if (isValid) { // password matches
                    createSession(req);
                    res.redirect('/welcome');
                } else { // password does not match
                    res.render('login', {
                        config,
                        navBar: getNavBar(req),
                        "userInvalid": true
                    });
                }
            });
        } else { // username does not match
            res.render('login', {
                config,
                navBar: getNavBar(req),
                "userInvalid": true
            });
        }
    });
}

exports.create = (req, res) => {
    res.render('create', {
        config,
        navBar: getNavBar(req)
    });
}

exports.parseCreateData = (req, res) => {
    // let username = req.body.username.replace()
    db.findAccount(req.body.username, (account) => {
        if(!account && req.body.username.trim().length > 0) {
            bcrypt.hash(req.body.password, null, null, (err, hashed_password) => {
                db.createAccount(req.body.full_name, req.body.username, hashed_password);
                res.redirect('/');
            });
        } else {
            // console.log("Username is already taken!");
            res.render('create', {
                config, 
                navBar: getNavBar(req),
                "userTaken": true
            });
        }
    });
}

exports.welcome = (req, res) => {
    db.findAccount(req.session.user.username, (account) => {
        db.findBoardsForUser(req.session.user.username, boards => {
            res.render('welcome', {
                config,
                navBar: getNavBar(req),
                name: account.full_name,
                boards
            });
        });
    });
}

exports.edit = (req, res) => {
    db.findAccount(req.session.user.username, (account) => {
        res.render('edit', {
            config,
            navBar: getNavBar(req),
            full_name: account.full_name,
            username: account.username
        });
    });
}

exports.updateUserData = (req, res) => {
    db.findAccount(req.body.username, otherAccount => {
        if (req.session.user.username !== req.body.username && otherAccount) { // username is already taken
            db.findAccount(req.session.user.username, account => {
                res.render('edit', {
                    config,
                    navBar: getNavBar(req),
                    full_name: account.full_name,
                    username: account.username,
                    userTaken: true
                });
            });
        } else { // username is not already taken
            db.findAccount(req.session.user.username, account => {
                bcrypt.compare(req.body.current_password, account.hashed_password, (err, result) => {
                    if (result) { // current password matches
                        bcrypt.hash(req.body.new_password ? req.body.new_password : "", null, null, (err, hashed_password) => {
                            db.updateAccount(req.session.user.username, req.body.full_name, req.body.username, (req.body.new_password ? hashed_password : account.hashed_password));
                            createSession(req);
                            res.redirect('/welcome');
                        });
                    } else { // current password does not match
                        res.render('edit', {
                            config,
                            navBar: getNavBar(req),
                            full_name: account.full_name,
                            username: account.username,
                            userInvalid: true
                        });
                    }
                });
                
            });
        }
    });
}

exports.board = (req, res) => {
    res.render('board', {
        config,
        navBar: getNavBar(req)
    });
}

exports.getBoardName = (req, res) => {
    res.render('getBoardName', {
        config,
        navBar: getNavBar(req)
    })
}

exports.createBoard = (req, res) => {
    let id = db.createBoard(req.body.boardName, req.session.user.username);
    res.redirect(`/board/${id}`);
}

exports.parseBoardData = (req, res) => {
    db.updateBoardData(req.session.board.id, req.text);
    res.send();
}

exports.loadBoardById = (req, res) => {
    db.findBoard(req.params.id, board => {
        if (board && board.users.includes(req.session.user.username)) {
            setSessionBoardId(req, board.id);
            res.render('board', {
                config,
                navBar: getNavBar(req),
                boardName: board.name,
                boardData: board.boardData
            });
        } else {
            res.redirect('/welcome');
        }
    });
}

exports.deleteBoardById = (req, res) => {
    db.deleteBoard(req.params.id);
    res.redirect('/welcome');
}

exports.getUsername = (req, res) => {
    res.render('getUsername', {
        config,
        navBar: getNavBar(req)
    })
}

exports.addUser = (req, res) => {
    db.addUserToBoard(req.session.board.id, req.body.username);
    res.redirect(`/board/${req.session.board.id}`);
}

exports.removeUser = (req, res) => {
    db.removeUserFromBoard(req.session.board.id, req.params.username);
    res.redirect(`/board/${req.session.board.id}`);

    // db.removeUserFromBoard(539682, req.params.username);
    // res.redirect(`/`);
}


// Helper methods

// Express session
const createSession = req => {
    req.session.user = {
        username: req.body.username,
        isAuthenticated: true
    };
    // console.log(req.session);
}
const destroySession = req => {
    // console.log(req.session);
    if (req.session.user) {
        req.session.destroy();
    }
}
const setSessionBoardId = (req, boardId) => {
    req.session.board = {
        id: boardId
    };
}

// Return the navBar object corresponding to the user's auth state
const getNavBar = req => {
    return (req.session.user && req.session.user.isAuthenticated) ? config.authNavBar : config.unauthNavBar;
}