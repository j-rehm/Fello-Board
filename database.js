const html_parser = require('node-html-parser')
const mongoose = require('mongoose');

mongoose.Promise = global.Promise;
mongoose.connect('mongodb+srv://Admin:AdminPass@felloboard-gbrvh.mongodb.net/data?retryWrites=true&w=majority', {useNewUrlParser: true, useUnifiedTopology: true});

const mdb = mongoose.connection;
mdb.on('error', console.error.bind(console, 'connection error:'));
mdb.once('open', callback => {
});


// User Account CRUD

var UserAccount = mongoose.model('user_accounts', mongoose.Schema({
    full_name: String,
    username: String,
    hashed_password: String
}));

/**
 * Creates a new user account and stores it in the database
 * @param {string} full_name Full name of the account to be created
 * @param {string} username Username of the account to be created
 * @param {string} hashed_password Hashed password of the account to be created
 */
exports.createAccount = (full_name, username, hashed_password) => {
    var userAccount = new UserAccount({
        full_name,
        username,
        hashed_password
    });
    saveAccount(userAccount);
}

/**
 * Finds an account in the database with matching username
 * @param {string} username Username of the account to find
 * @param {callback} callback Calback with account result. To be fired once an account has been found or if the account does not exist
 */
exports.findAccount = async (username, callback) => {
    UserAccount.findOne({ "username": username }, (err, account) => {
        handleIfError(err);
        callback(account);
    });
}

/**
 * Updates the current full_name, username, and hashed_password of a user account with given info
 * @param {string} username Username of account to find
 * @param {string} full_name New full name to update account with
 * @param {string} new_username New username to update account with
 * @param {string} new_hashed_password New hashed password to update account with
 */
exports.updateAccount = (username, new_full_name, new_username, new_hashed_password) => {
    UserAccount.updateOne({ "username": username }, { $set: {
        "full_name": new_full_name,
        "username": new_username,
        "hashed_password": new_hashed_password
    }}, (err, result) => {
        handleIfError(err);
    });
}


// Board CRUD

var Board = mongoose.model('boards', mongoose.Schema({
    id: Number,
    name: String,
    users: [String],
    boardData: String
}));

let nextId = 0;

/**
 * Creates a new board with a  and stores it in the database
 * @param {string} name Name of the board to be created
 * @param {string} username Username of user who created the page
 * @returns The id of the board created
 */
exports.createBoard = (name, username) => {
    let id = nextId++;
    var board = new Board({
        id,
        name,
        users: [username],
        boardData: ""
    });
    board.save((err, board) => {
        handleIfError(err);
    });
    return id;
}

/**
 * Finds the board in the database with matching id
 * @param {Number} id Id of the board to find
 * @param {callback} callback Callback with board result. To be fired once a board has been found or if the board does not exist
 */
exports.findBoard = async (id, callback) => {
    Board.findOne({ "id": id }, (err, board) => {
        handleIfError(err);
        callback(board);
    });
}

/**
 * Finds the id and name of each board where username is included in users list
 * @param {string} username Username to look for
 * @param {callback} callback Callback with list of board ids and names. To be fired when every board has been checked
 */
exports.findBoardsForUser = async (username, callback) => {
    let boards = []
    Board.find({ "users": { $in: [username] } }, (err, _boards) => {
        handleIfError(err);
        _boards.forEach(board => {
            boards.push([
                board.id,
                board.name
            ]);
        });
        callback(boards);
    });
}

/**
 * Reads the board data string and parses it into an HTML DOM fragment object
 * @param {board} board Board to read
 * @returns The parsed DOM object
 */
exports.readBoardData = (board) => {
    let boardData = html_parser.parse(board.boardData);
    return boardData;
}


/**
 * Updates the current boardData of a board with given boardData
 * @param {Number} id Id of the board to update
 * @param {string} newBoardData DOM string to update boardData with
 */
exports.updateBoardData = (id, newBoardData) => {
    Board.updateOne({ "id": id }, { $set: { "boardData": newBoardData } }, (err, result) => {
        handleIfError(err);
    });
};

/**
 * Deletes the board with given id
 * @param {Number} id Id of board to delete
 */
exports.deleteBoard = id => {
    Board.remove({ "id": id }, err => {
        handleIfError(err);
    });
};

/**
 * Adds a username to the users list of a board
 * @param {Number} id Id of board to add username to
 * @param {string} username Username to add to the users list
 * @param {callback} callback Callback with result. To be fired when function is finished
 */
exports.addUserToBoard = (id, username, callback) => {
    this.findBoard(id, board => {
        let users = board.users;
        users.push(username);
        Board.updateOne({ "id": id }, { $set: { "users": users } }, (err, result) => {
            handleIfError(err);
            callback(result);
        });
    });
};

/**
 * Removes a user from the users list of a board
 * @param {Number} id Id of board to remove username from
 * @param {string} username Username to remove from the users list
 * @param {callback} callback Callback with result. To be fired when function is finished
 */
exports.removeUserFromBoard = (id, username, callback) => {
    this.findBoard(id, board => {
        let users = board.users;
        let idx = users.indexOf(username);
        if (idx > -1) {
            users.splice(idx, 1);
        }
        Board.updateOne({ "id": id }, { $set: { "users": users } }, (err, result) => {
            handleIfError(err);
            callback(result);
        });
    });
}



// Helper functions

const handleIfError = err => {
    if (err) {
        console.error(err);
    }
};

const saveAccount = account => {
    account.save((err, board) => {
        handleIfError(err);
    });
}

const getNextBoardId = callback => {
    let id = Math.floor(100000 + Math.random() * 900000);
    this.findBoard(id, board => {
        if (board) {
            x = 1;
            callback(getNextBoardId());
        } else {
            callback(id);
        }
    });
};

const saveBoard = board => {
    board.save((err, board) => {
        handleIfError(err);
    });
}


//Code

getNextBoardId(id => {
    if (id) {
        nextId = id;
    }
})