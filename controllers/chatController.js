const User = require("../models/users");
const Messages = require("../models/messages");

exports.getMessage = async (req, res) => {
  const friendUsername = req.params.username;
  const user = req.user;
  if (!user) {
    res.status(404).render("error.ejs");
    return;
  }
  if (friendUsername === user.username) {
    res.status(404).render("error.ejs");
    return;
  }
  const friendUser = await User.findOne({ username: friendUsername });
  if (!friendUser) {
    res.status(404).render("error.ejs");
    return;
  }
  const userMessages = await Messages.find({
    "receiver.id": friendUser._id,
    "sender.id": user._id,
  });
  const friendUserMessages = await Messages.find({
    "receiver.id": user._id,
    "sender.id": friendUser._id,
  });
  const messages = [...userMessages, ...friendUserMessages];
  messages.sort((a, b) => a.timestamp - b.timestamp);
  res.render("chats", { user, friendUsername, messages });
};

exports.postMessage = async (req, res) => {
  const user = req.user;
  const friendUsername = req.params.username;
  console.log(user.username);
  console.log(friendUsername);
  const message = req.body.message;
  // console.log(req);
  console.log(message);
  // res.send('hi')
  try {
    const friendUser = await User.findOne({ username: friendUsername });
    console.log(message);
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
    res.redirect(`/chat/${friendUsername}`);
  } catch (err) {
    console.log(err);
    res.status(404).render("error.ejs");
    return;
  }
};
