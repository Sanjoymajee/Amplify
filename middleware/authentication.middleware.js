exports.isAuth = (req, res, next) => {
  if (req.user) {
    next()
  } else {
    res.redirect('/auth/login')
  }
}

exports.isNotAuth = (req, res, next) => {
  if (req.user) {
    res.redirect('/')
  } else {
    next()
  }
}
