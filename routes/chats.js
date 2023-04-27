const promiseRouter = require("express-promise-router");
const router = promiseRouter();
const { postMessage, getMessage } = require("../controllers/chatController");

const { isAuth, isNotAuth } = require("../middleware/isAuthenticated");
const { isFriend } = require("../middleware/isFriend");

router.get("/chat/:username", isAuth, isFriend, getMessage);

module.exports = router;
