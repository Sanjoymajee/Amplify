const promiseRouter = require("express-promise-router");
const router = promiseRouter();
const {
  getFriends,
  getAddFriends,
  postAcceptFriendRequest,
  postSendFriendRequest,
} = require("../controllers/friendsController");

router.get("/friends", getFriends);

router.get("/friends/add", getAddFriends);

router.post("/friends/acceptRequest", postAcceptFriendRequest);

router.post("/friends/sendRequest", postSendFriendRequest);

module.exports = router;
