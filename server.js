const express = require("express");
const app = express();
const flash = require('connect-flash');
require("dotenv").config();
const path = require('path');
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
const ejs = require('ejs');
app.use(express.static(path.join(__dirname, "public")));
app.set("view engine", "ejs");

app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

app.use(flash());

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

passport.use('login',new LocalStrategy(async (username, password, done) => {
    try {
      const user = await User.findOne({ username });
      if (!user) {
        return done(null, false, { message: "Incorrect username" });
      }
      const passwordMatch = bcrypt.compare(password, user.password);
      if (passwordMatch) {
        return done(null, false, { message: "Incorrect password" });
      }
      return done(null, user);
    } catch (err) {
      return done(err);
    }
  })
);

passport.use('signup', new LocalStrategy(async (username, password, done) => {
  try {
      const user = await User.findOne({ username });
      if (user) {
          return done(null, false, { message: 'Username already taken' });
      }
      const newUser = new User({ username, password });
      newUser
        .save()
        .then((user) => {
          req.login(user, (err) => {
            if (err) console.log(err);
            res.redirect("/");
          });
        })
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

// chechUsername middleware
// function checkUsername(req, res, next) {
//   const { username } = req.body;

//   User.findOne({ username }, (err, user) => {
//     if (err) return next(err);
//     if (user) {
//       req.flash('error', 'Username is already taken');
//       return res.redirect('/login');
//     }
//     next();
//   });
// }


// Set up routes
app.get('/',(req,res) => {
  console.log(req.user)
  res.redirect('/home');
})

app.get('/home', (req, res) => {
  console.log(req.user)
  res.render('home',{user : req.user});
});

// app.get("/dashboard",ensureAuthenticated,(req,res) => {
//   //console.log(req.user);
//   res.send("Welcome User");
// })

app.get("/login",(req, res) => {
  const errorMessage = req.flash('error')[0];
  // console.log(errorMessage)
  res.render('login',{message : errorMessage});
});

app.get("/signup", (req, res) => {
  const errorMessage = req.flash('error')[0];
  // console.log(errorMessage)
  res.render('signup',{message : errorMessage});
});

// app.post("/signup",checkUsername, (req, res, next) => {
//   const { username, password } = req.body;
//   const newUser = new User({ username, password });
//   newUser
//     .save()
//     .then((user) => {
//       req.login(user, (err) => {
//         if (err) console.log(err);
//         res.redirect("/");
//       });
//     })
//     .catch((err) => console.log(err));
// });

// Sign up route using Passport and failureFlash option
app.post('/signup', passport.authenticate('signup', {
  successRedirect: '/',
  failureRedirect: '/signup',
  failureFlash: true
}));

app.post('/login', passport.authenticate('login', {
  successRedirect: '/',
  failureRedirect: '/login',
  failureFlash: true
}));

app.post('/logout', function(req, res, next) {
  req.logout(function(err) {
    if (err) { return next(err); }
    //console.log(req.user);
    res.redirect('/');
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
