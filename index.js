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
const MONGODB_URI_LOCAL = process.env.DATABASE_LOCAL;
const SESSION_SECRET = process.env.SESSION_SECRET;
const PORT = process.env.PORT || 8888;
const MongoDBStore = require("connect-mongodb-session")(session);
const store = new MongoDBStore({
  uri: MONGODB_URI,
  collection: "sessions",
});

const homeRouter = require("./routes/home");
const authRouter = require("./routes/auth");
const friendRouter = require("./routes/friends");
const profileRouter = require("./routes/profile");
const chatRouter = require("./routes/chats");
const User = require("./models/users");
const Messages = require("./models/messages");

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

app.use(friendRouter);

app.use(profileRouter);

app.use(chatRouter);

io.on("connection", (socket) => {
  socket.on("checkUsername", async (userData, callback) => {
    const isAvailable =
      (await User.findOne({ username: userData.username })) === null;
    callback(isAvailable);
  });

  socket.on("chat-room", async ({ username }) => {
    const user = await User.findOne({ username });
    user.socketId = socket.id;
    await user.save();
  });

  // Handle incoming messages from clients
  socket.on("chat-message", async ({ message, friendUsername, username }) => {
    try {
      // Look up the sender and receiver users in your MongoDB database
      const user = await User.findOne({ username });
      // console.log(user);
      const friendUser = await User.findOne({ username: friendUsername });
      // console.log(friendUser);

      // Create a new message in your MongoDB database
      const newMessage = new Messages({
        sender: {
          id: user._id,
          username: user.username,
        },
        receiver: {
          id: friendUser._id,
          username: friendUser.username,
        },
        message,
      });

      await newMessage.save();

      // Send the new message to both the sender and receiver clients
      io.to(socket.id).emit("chat-message", newMessage);
      socket.broadcast.to(friendUser.socketId).emit("chat-message", newMessage);
    } catch (err) {
      console.error("Error creating new message", err);
      socket.emit("error", { message: "Error creating new message" });
    }
  });

  socket.on("disconnect", async () => {
    try {
      const user = await User.findOne({ socketId: socket.id });
      if (user) {
        user.socketId = null;
        await user.save();
      }
    } catch (err) {
      console.error("Error disconnecting socket", err);
    }
  });
});

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
