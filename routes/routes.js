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
        config,
        navBar: getNavBar(req)
    });
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

exports.welcome = (req, res) => {
    db.findAccount(req.session.user.username, (account) => {
        db.findBoardsIdsForUser(req.session.user.username, ids => {
            res.render('welcome', {
                config,
                navBar: getNavBar(req),
                name: account.full_name,
                ids
            });
        });
    });
}

exports.edit = (req, res) => {
    db.findAccount(req.session.user.username, (account) => {
        res.render('edit', {
            config,
            navBar: getNavBar(req),
            name: account.full_name,
            username: account.username,
        });
    });
}

exports.updateUserData = (req, res) => {

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
    db.updateBoardData(req.body.id, req.body.boardData);
    res.send();
}

exports.loadBoardFromId = (req, res) => {
    db.findBoard(req.params.id, board => {
        if (board) {
            res.render('board', {
                config,
                navBar: getNavBar(req),
                boardName: board.name,
                boardData: board.boardData
            });
            res.send(board.id);
        } else {
            res.redirect('/');
        }
    });
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

// Determine if user is authenticated
const getNavBar = req => {
    return (req.session.user && req.session.user.isAuthenticated) ? config.authNavBar : config.unauthNavBar;
}

// Test function
exports.test = (req, res) => {
    // db.findBoardsIdsForUser(req.params.x, ids => {
    //     res.json(ids);
    // });

    console.log(req.body);
}