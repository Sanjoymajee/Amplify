require("dotenv").config();
require("ejs");
require("./auth");
const express = require("express");
const app = express();
const flash = require("connect-flash");
const path = require("path");
const session = require("express-session");
const passport = require("passport");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const MONGODB_URI = process.env.DATABASE;
const MongoDBStore = require("connect-mongodb-session")(session);
const store = new MongoDBStore({
  uri: MONGODB_URI,
  collection: "sessions",
});

app.use(express.static(path.join(__dirname, "public"))); // Set up static files
app.set("view engine", "ejs"); // Set up EJS as the view engine
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
app.use(flash()); // Set up flash messages

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

// Set up routes
app.get("/", (req, res) => {
  res.redirect("/home");
});

app.get("/home", (req, res) => {
  res.render("home", { user: req.user });
});

app.get("/auth/login", (req, res) => {
  const errorMessage = req.flash("error")[0];
  res.render("login", { message: errorMessage });
});

app.get("/auth/signup", (req, res) => {
  const errorMessage = req.flash("error")[0];
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
    res.redirect("/");
  });
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
