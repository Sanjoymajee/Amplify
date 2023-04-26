const promiseRouter = require("express-promise-router");
const router = promiseRouter();
const { postMessage, getMessage } = require("../controllers/chatController");

const { isAuth, isNotAuth } = require("../middleware/isAuthenticated");

router.get("/chat/:username", isAuth, getMessage);

module.exports = router;
