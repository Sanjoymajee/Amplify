const promiseRouter = require("express-promise-router");
const router = promiseRouter();
const {
  getFriends,
  getAddFriends,
  postAcceptFriendRequest,
  postSendFriendRequest,
} = require("../controllers/friendsController");

const {isAuth, isNotAuth} = require("../middleware/isAuthenticated");

router.get("/friends",isAuth, getFriends);

router.get("/friends/add",isAuth, getAddFriends);

router.post("/friends/acceptRequest",isAuth, postAcceptFriendRequest);

router.post("/friends/sendRequest", isAuth, postSendFriendRequest);

module.exports = router;
