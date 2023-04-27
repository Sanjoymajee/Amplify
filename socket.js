const socket = require("socket.io");
const User = require("./models/users");
const Messages = require("./models/messages");

function socketConnection(server) {
  const io = socket(server);
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

    socket.on("ping", (data) => {
      // console.log(data);
    });

    // Handle incoming messages from clients
    socket.on("chat-message", async ({ message, friendUsername }) => {
      try {
        // Look up the sender and receiver users in your MongoDB database
        const user = await User.findOne({ socketId: socket.id });
        const friendUser = await User.findOne({ username: friendUsername });
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
        socket.broadcast
          .to(friendUser.socketId)
          .emit("chat-message", newMessage);
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
}

module.exports = socketConnection;
