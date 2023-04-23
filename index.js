require("dotenv").config();
require("ejs");
require("./auth");
const express = require("express");
const app = express();
const server = require("http").createServer(app);
const io = require("socket.io")(server);
const flash = require("connect-flash");
const path = require("path");
const session = require("express-session");
const passport = require("passport");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const MONGODB_URI = process.env.DATABASE;
const SESSION_SECRET = process.env.SESSION_SECRET;
const PORT = process.env.PORT || 8888;
const MongoDBStore = require("connect-mongodb-session")(session);
const store = new MongoDBStore({
  uri: MONGODB_URI,
  collection: "sessions",
});

const homeRouter = require("./routes/home");
const authRouter = require("./routes/auth");
const User = require("./models/users");

app.set("view engine", "ejs"); // Set up EJS as the view engine
app.use(express.static(path.join(__dirname, "public"))); // Set up static files
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
app.use(flash()); // Set up flash messages

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

io.on("connection", (socket) => {
  socket.on("checkUsername", async (userData, callback) => {
    const isAvailable =
      (await User.findOne({ username: userData.username })) === null;
    callback(isAvailable);
  });
});

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(MONGODB_URI, {
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
    console.log("listening for requests");
  });
});
