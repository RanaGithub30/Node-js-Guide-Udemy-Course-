exports.login = (req, res, next) => {
    console.log(req.session);
    res.render('auth/login', {
        pageTitle: 'Login',
        path: '/',
      });
}

exports.postLogin = (req, res, next) => {
    res.setHeader('Set-Cookie', 'loggedIn=true');
    req.session.isLoggedIn = true;  // set up the session
    res.redirect('/');
}

exports.logout = (req, res, next) => {
    req.session.destroy(() => {
        res.redirect('/')
    });
}