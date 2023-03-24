const express = require("express");
const app = express();
const flash = require("connect-flash");
require("dotenv").config();
const path = require("path");
const session = require("express-session");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const bcrypt = require("bcrypt");
const User = require("./models/users");
const mongoose = require("mongoose");
const MONGODB_URI = process.env.DATABASE;
const GOOGLE_CLIENT_ID = process.env.CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.CLIENT_SECRET;
const bodyParser = require("body-parser");
const MongoDBStore = require("connect-mongodb-session")(session);
const store = new MongoDBStore({
  uri: MONGODB_URI,
  collection: "sessions",
});
const ejs = require("ejs");
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
    store: store,
  })
);

// Set up passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Set up the local strategy for username and password authentication

passport.use(
  "login",
  new LocalStrategy(async (username, password, done) => {
    try {
      const user = await User.findOne({ username });
      // console.log(user)
      if (!user) {
        return done(null, false, { message: "Incorrect username" });
      }
      if (!user.password) {
        return done(null, false, { message: "Username already taken" });
      }
      const passwordMatch = await bcrypt.compare(password, user.password);
      // console.log(passwordMatch)
      if (!passwordMatch) {
        return done(null, false, { message: "Incorrect password" });
      }
      return done(null, user);
    } catch (err) {
      return done(err);
    }
  })
);

// Set up the local strategy for username and password authentication
passport.use(
  "signup",
  new LocalStrategy(async (username, password, done) => {
    try {
  const user = await User.findOne({ username });
      if (user) {
        return done(null, false, { message: "Username already taken" });
      }
      const newUser = new User({ username, password });
      newUser.save().then((user) => {
        return done(null, user);
      });
    } catch (err) {
      return done(err);
    }
  })
);

passport.use(
  new GoogleStrategy(
    {
      clientID: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
      callbackURL: "http://localhost:3000/auth/google/callback",
      passReqToCallback: true,
    },
    async (request, accessToken, refreshToken, profile, done) => {
      const user = await User.findOneAndUpdate(
        { googleId: profile.id }, // Search query
        {
          $setOnInsert: {
            // Update or insert if not exists
            displayName: profile.displayName,
            googleId: profile.id,
            email: profile.emails[0].value,
            username: profile.emails[0].value.split("@")[0], // making username the part before the @ in the email
          },
        },
        { upsert: true, new: true, setDefaultsOnInsert: true } // Options to return the new document if it doesn't exist
      );
      return done(null, user); 
    }
  )
);

// ensureAuthenticated middleware
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/auth/login");
}

// Set up routes
app.get("/", (req, res) => {
  res.redirect("/home");
});

app.get("/home", (req, res) => {
  // console.log(req.user);
  res.render("home", { user: req.user });
});

app.get("/auth/login", (req, res) => {
  const errorMessage = req.flash("error")[0];
  // console.log(errorMessage)
  res.render("login", { message: errorMessage });
});

app.get("/auth/signup", (req, res) => {
  const errorMessage = req.flash("error")[0];
  // console.log(errorMessage)
  res.render("signup", { message: errorMessage });
});

// Google Oauth GET route
app.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);
// Google Oauth callback route
app.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    successRedirect: "/",
    failureRedirect: "/auth/login",
  })
);

// Sign up route using Passport and failureFlash option
app.post(
  "/auth/signup",
  passport.authenticate("signup", {
    successRedirect: "/",
    failureRedirect: "/auth/signup",
    failureFlash: true,
  })
);

app.post(
  "/auth/login",
  passport.authenticate("login", {
    successRedirect: "/",
    failureRedirect: "/auth/login",
    failureFlash: true,
  })
);

app.post("/auth/logout", function (req, res, next) {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    //console.log(req.user);
    res.redirect("/");
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
