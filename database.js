const html_parser = require('node-html-parser')
const mongoose = require('mongoose');

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

var Board = mongoose.model('boards', mongoose.Schema({
    id: Number,
    name: String,
    users: [String],
    boardData: String
}));

/**
 * Creates a user account and stores it in the database
 * @param {string} full_name Given full name of the account to be created
 * @param {string} username Given username of the account to be created
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
        if (err) return console.error(err);
    });
};

/**
 * Finds an account in the database with username as the key
 * @param {string} username Username of the account to find
 * @param {callback} callback Calback with account result. To be fired once an account has been found or if the account does not exist
 */
exports.findAccount = async (username, callback) => {
    UserAccount.findOne({"username": username}, (err, account) => {
        if (err) {
            console.log(err);
        }
        return callback(account);
    });
};

exports.createBoard = (id, name, user, boardData) => {
    var board = new Board({
        id,
        name,
        users: [user],
        boardData
    });
    board.save((err, board) => {
        if (err) return console.error(err);
    });
}

exports.findBoard = async (id, callback) => {
    Board.findOne({"id": id}, (err, board) => {
        if (err) {
            console.log(err);
        }
        return callback(board);
    });
};

exports.deleteBoard = async id => {
    Board.remove({"id": id}, err => {
        if (err) {
            console.log(err);
        }
    });
};

exports.readBoardData = (board) => {
    let boardData = html_parser.parse(board.boardData);
    return boardData;
}