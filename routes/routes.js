exports.index = (req, res) => {
    res.render('index', {
        "title": "Login",
        "username": "Username: ",
        "password": "Password: ",
        "noAccount": "Don't have an account? Click here!"
    });
}

exports.test = (req, res) => {
    res.render('testDIV');
}