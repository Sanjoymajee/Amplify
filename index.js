require("dotenv").config();
require("ejs");
require("./auth");
const express = require("express");
const app = express();
const server = require("http").createServer(app);
const flash = require("connect-flash");
const path = require("path");
const session = require("express-session");
const passport = require("passport");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const MONGODB_URI = process.env.DATABASE;
const MONGODB_URI_LOCAL = process.env.DATABASE_LOCAL;
const SESSION_SECRET = process.env.SESSION_SECRET;
const PORT = process.env.PORT || 8888;
const cors = require('cors');
const MongoDBStore = require("connect-mongodb-session")(session);
const store = new MongoDBStore({
  uri: MONGODB_URI_LOCAL,
  collection: "sessions",
});

const homeRouter = require("./routes/home");
const authRouter = require("./routes/auth");
const friendRouter = require("./routes/friends");
const profileRouter = require("./routes/profile");
const chatRouter = require("./routes/chats");
const ajaxRouter = require("./routes/ajax");
const socketConnection = require("./socket");

app.set("view engine", "ejs"); // Set up EJS as the view engine
app.set("views", path.join(__dirname, "views")); // Set up views directory
app.use(express.static(path.join(__dirname, "public"))); // Set up static files
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
app.use(flash()); // Set up flash messages
app.use(cors());

// Set up session middleware
app.use(
  session({
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: store,
  })
);

// Set up passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Set up routes

app.use(homeRouter);

app.use(authRouter);

app.use(friendRouter);

app.use(profileRouter);

app.use(chatRouter);

app.use(ajaxRouter);

socketConnection(server);

app.use((req, res, next) => {
  res.status(404).render("error.ejs");
});

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(MONGODB_URI_LOCAL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

// Start server
connectDB().then(() => {
  server.listen(PORT, () => {
    console.log(`listening for requests at PORT ${PORT}`);
  });
});
