const passport = require("passport");

exports.getLogin = (req, res) => {
  const errorMessage = req.flash("error")[0];
  res.render("login", { message: errorMessage,user : req.user });
};

exports.getSignup = (req, res) => {
  const errorMessage = req.flash("error")[0];
  res.render("signup", { message: errorMessage, user : req.user });
};

exports.getGoogle = passport.authenticate("google", {
  scope: ["profile", "email"],
});

exports.getGoogleCallback = passport.authenticate("google", {
  successRedirect: "/",
  failureRedirect: "/auth/login",
});

exports.postSignup = passport.authenticate("signup", {
  successRedirect: "/",
  failureRedirect: "/auth/signup",
  failureFlash: true,
});

exports.postLogin = passport.authenticate("login", {
  successRedirect: "/",
  failureRedirect: "/auth/login",
  failureFlash: true,
});

exports.postLogout = (req, res, next) => {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    req.session.destroy(function(err) {
      if(err)return next(err);
      res.redirect('/');
    });
    // res.redirect("/");
  });
};
