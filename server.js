const express = require("express");
require("dotenv").config();
const session = require("express-session");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcrypt");
const User = require("./model");
const mongoose = require("mongoose");
const MONGODB_URI = process.env.DATABASE;
const bodyParser = require("body-parser");
const MongoDBStore = require("connect-mongodb-session")(session);
const store = new MongoDBStore({
  uri: MONGODB_URI,
  collection: "sessions",
});

const app = express();

app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

// Set up session middleware
app.use(
  session({
    secret: "mysecret",
    resave: false,
    saveUninitialized: false,
    store: store
  })
);

// Set up passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Set up the local strategy for username and password authentication

passport.use(
  new LocalStrategy(async (username, password, done) => {
    try {
      const user = await User.findOne({ username });
      if (!user) {
        return done(null, false, { message: "Incorrect username." });
      }
      const passwordMatch = bcrypt.compare(password, user.password);
      if (!passwordMatch) {
        return done(null, false, { message: "Incorrect password." });
      }
      return done(null, user);
    } catch (err) {
      return done(err);
    }
  })
);

// ensureAuthenticated middleware
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/login");
}


// Set up routes
app.get("/", (req, res) => {
  res.send(`
    <form method="POST" action="/logout">
      <button type="submit">Log out</button>
    </form>
  `);
});

app.get("/dashboard",ensureAuthenticated,(req,res) => {
  //console.log(req.user);
  res.send("Welcome User");
})

app.get("/login",(req, res) => {
  res.send(`
    <form method="POST" action="/login">
      <input type="text" name="username" placeholder="Username">
      <input type="password" name="password" placeholder="Password">
      <button type="submit">Log in</button>
    </form>
  `);
});

app.get("/signin", (req, res) => {
  res.send(`
        <form method="POST" action="/signin">
        <input type="text" name="username" placeholder="Username">
        <input type="password" name="password" placeholder="Password">
        <button type="submit">Sign in</button>
        </form>
    `);
});

app.post("/signin", (req, res, next) => {
  const { username, password } = req.body;
  const newUser = new User({ username, password });
  newUser
    .save()
    .then((user) => {
      req.login(user, (err) => {
        if (err) console.log(err);
        res.redirect("/dashboard");
      });
    })
    .catch((err) => console.log(err));
});

app.post('/login', passport.authenticate('local', {
  successRedirect: '/dashboard',
  failureRedirect: '/login',
  failureFlash: true
}));

app.post('/logout', function(req, res, next) {
  req.logout(function(err) {
    if (err) { return next(err); }
    //console.log(req.user);
    res.redirect('/login');
  });
});


// Serialize and deserialize user object
passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

mongoose
  .connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("connected to dB");
  });

// Start server
app.listen(3000, () => {
  console.log("Server started on port 3000");
});
