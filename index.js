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

app.get("/friends", async (req, res) => {
  const user = req.user;
  const friends = user.friends;
  const friendRequests = user.friendRequests;
  const message = req.query.message;
  // console.log(friends);
  // console.log(friendRequests)
  res.render("friends", { user, friends, friendRequests, message });
});

app.get('/friends/add', (req, res) => {
  const message = req.query.message;
  res.render('addFriends', { user: req.user , message});
});

app.post('/friends/acceptRequest', async (req, res) => {
  const { friendId } = req.body;
  const user = req.user;
  console.log(friendId);
  try {
    const friendUser = await User.findById(friendId);
    const requests = user.friendRequests;
    const requestIndex = requests.findIndex(friend => friend.userId.toString() === user._id.toString());
    requests.splice(requestIndex, 1);
    friendUser.friends.push({
      userId: user._id,
      username: user.username,
    });
    await friendUser.save();
    user.friends.push({
      userId: friendUser._id,
      username: friendUser.username,
    });
    await user.save();
    const message = 'Friend request accepted!';
    res.redirect('/friends?message=' + message);
  }
  catch (err) {
    console.error(`Error accepting friend request: ${err.message}`);
    const message = 'An error occurred while accepting the friend request.';
    res.redirect('/friends?message=' + message);
  }
});

app.post('/friends/sendRequest', async (req, res) => {
  const { friendUsername } = req.body;
  const user = req.user;
  
  try {
    const friendUser = await User.findOne({ username: friendUsername });
    if (friendUser) {
      const friendId = friendUser._id;
      const friendRequests = friendUser.friendRequests;
      for(const friend of user.friends) {
        if (friend.userId.toString() === friendId.toString()) {
          const message = 'You are already friends with this user.';
          res.redirect('/friends/add?message=' + message);
          return;
        }
      }

      // console.log(friendRequests.includes({userId : req.user._id}));
      for(const friendRequest of friendRequests) {
        if (friendRequest.userId.toString() === user._id.toString()) {
          const message = 'You have already sent a friend request to this user.';
          res.redirect('/friends/add?message=' + message);
          return;
        }
      }
      friendRequests.push({
        userId: user._id,
        username: user.username,
      });
      await friendUser.save();
      // req.session.message = 'Friend request sent!';
      const message = 'Friend request sent!';
      res.redirect('/friends/add?message=' + message);
      // res.render('addFriends', { user: req.user, message: 'Friend request sent!' });
    
    } else {
      const message = 'No user with that username was found.';
      res.redirect('/friends/add?message=' + message);
      // res.render('addFriends', { user: req.user, message: 'No user with that username was found.' });
    }
  } catch (err) {
    console.error(`Error sending friend request: ${err.message}`);
    const message = 'An error occurred while sending the friend request.';
    res.redirect('/friends/add?message=' + message);
    // res.render('addFriends', { user: req.user, message: 'An error occurred while sending the friend request.' });
  }
});

io.on("connection", (socket) => {
  socket.on("checkUsername", async (userData, callback) => {
    const isAvailable =
      (await User.findOne({ username: userData.username })) === null;
    callback(isAvailable);
  });
});

app.use((req, res, next) => {
  res.status(404).render('error.ejs');
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
