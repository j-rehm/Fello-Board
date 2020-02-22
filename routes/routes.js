exports.index = (req, res) => {
    res.render('index', {

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

    });
}

exports.parseCreateData = (req, res) => {
    res.redirect('/home');
}

exports.home = (req, res) => {
    res.render('home', {
        
    });
}
