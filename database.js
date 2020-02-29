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
    // console.log(`${full_name}, ${username}, ${hashed_password}`)
    var userAccount = new UserAccount({
        full_name,
        username,
        hashed_password
    });
    userAccount.save((err, account) => {
        handleIfError(err);
    });
}

/**
 * Finds an account in the database with username as the key
 * @param {string} username Username of the account to find
 * @param {callback} callback Calback with account result. To be fired once an account has been found or if the account does not exist
 */
exports.findAccount = async (username, callback) => {
    UserAccount.findOne({"username": username}, (err, account) => {
        handleIfError(err);
        callback(account);
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
 * @param
 */
exports.createBoard = (name, user, boardData) => {
    var board = new Board({
        id: nextId++,
        name,
        users: [user],
        boardData
    });
    board.save((err, board) => {
        handleIfError(err);
    });
}

exports.findBoard = async (id, callback) => {
    Board.findOne({"id": id}, (err, board) => {
        handleIfError(err);
        callback(board);
    });
}

exports.findBoardsIdsForUser = async (username, callback) => {
    ids = []
    Board.find({ "users": { $in: [username] } }, (err, boards) => {
        handleIfError(err);
        boards.forEach(board => {
            ids.push(board.id);
        });
        callback(ids);
    });
}

exports.readBoardData = (board) => {
    let boardData = html_parser.parse(board.boardData);
    return boardData;
}

// exports.updateBoardData = (board, newBoardData) => {
//     board.boardData = newBoardData;
// };

// exports.addUsersToBoard = (board, users) => {
//     users.forEach(username => {
//         this.addUserToBoard(board, username);
//     });
// };

// exports.addUserToBoard = (board, username) => {
//     board.users.push(username);
// };

// exports.deleteBoard = id => {
//     Board.remove({"id": id}, err => {
//         handleIfError(err);
//     });
// };


// Helper functions

const handleIfError = err => {
    console.error(err);
};

const getNextBoardId = callback => {
    Board.find({}, (err, boards) => {
        handleIfError(err);
        if (boards.length > 0) {
            boards.sort((a, b) => (a.id < b.id) ? 1 : -1);
            callback(boards[0].id + 1);
        }
    })
};

//Code


getNextBoardId(id => {
    if (id) {
        nextId = id;
    }
})