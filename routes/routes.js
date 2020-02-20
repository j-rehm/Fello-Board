exports.index = (req, res) => {
    res.render('index', {
        "title": "Login",
        "username": "Username: ",
        "password": "Password: ",
        "noAccount": "Don't have an account? Click here!"
    });
}

exports.validateLogin = (req, res) => {
    //work on this once db is created
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
