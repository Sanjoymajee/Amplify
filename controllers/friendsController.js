const User = require("../models/users");

exports.getFriends = async (req, res) => {
  const user = req.user;
  const friends = user.friends;
  const friendRequests = user.friendRequests;
  const message = req.query.message;
  // console.log(friends);
  // console.log(friendRequests)
  res.render("friends", { user, friends, friendRequests, message });
};

exports.getAddFriends = (req, res) => {
  const message = req.query.message;
  res.render("addFriends", { user: req.user, message });
};

exports.postAcceptFriendRequest = async (req, res) => {
  const { friendId } = req.body;
  const user = req.user;
//   console.log(friendId);
  try {
    const friendUser = await User.findById(friendId);
    const requests = user.friendRequests;
    const requestIndex = requests.findIndex(
      (friend) => friend.userId.toString() === user._id.toString()
    );
    requests.splice(requestIndex, 1);
    friendUser.friends.push({
      userId: user._id,
      username: user.username,
      email: user.email,
    });
    await friendUser.save();
    user.friends.push({
      userId: friendUser._id,
      username: friendUser.username,
      email: friendUser.email,
    });
    await user.save();
    const message = "Friend request accepted!";
    res.redirect("/friends?message=" + message);
  } catch (err) {
    console.error(`Error accepting friend request: ${err.message}`);
    const message = "An error occurred while accepting the friend request.";
    res.redirect("/friends?message=" + message);
  }
};

exports.postSendFriendRequest = async (req, res) => {
  const friendUsername = req.body.friendUsername.toLowerCase();
  const user = req.user;

  try {
    if(friendUsername === user.username) {
      const message = "You cannot send a friend request to yourself.";
      res.redirect("/friends/add?message=" + message);
      return;
    }
    const friendUser = await User.findOne({ username: friendUsername });
    if (friendUser) {
      const friendId = friendUser._id;
      const friendRequests = friendUser.friendRequests;
      for (const friend of user.friends) {
        if (friend.userId.toString() === friendId.toString()) {
          const message = "You are already friends with this user.";
          res.redirect("/friends/add?message=" + message);
          return;
        }
      }

      // console.log(friendRequests.includes({userId : req.user._id}));
      for (const friendRequest of friendRequests) {
        if (friendRequest.userId.toString() === user._id.toString()) {
          const message =
            "You have already sent a friend request to this user.";
          res.redirect("/friends/add?message=" + message);
          return;
        }
      }
      friendRequests.push({
        userId: user._id,
        username: user.username,
        email: user.email,
      });
      await friendUser.save();
      // req.session.message = 'Friend request sent!';
      const message = "Friend request sent!";
      res.redirect("/friends/add?message=" + message);
      // res.render('addFriends', { user: req.user, message: 'Friend request sent!' });
    } else {
      const message = "No user with that username was found.";
      res.redirect("/friends/add?message=" + message);
      // res.render('addFriends', { user: req.user, message: 'No user with that username was found.' });
    }
  } catch (err) {
    console.error(`Error sending friend request: ${err.message}`);
    const message = "An error occurred while sending the friend request.";
    res.redirect("/friends/add?message=" + message);
    // res.render('addFriends', { user: req.user, message: 'An error occurred while sending the friend request.' });
  }
};
