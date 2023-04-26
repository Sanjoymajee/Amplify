const promiseRouter = require("express-promise-router");
const router = promiseRouter();
const { postMessage, getMessage } = require("../controllers/chatController");

router.get("/chat/:username", getMessage);

// router.post("/chat/:username", postMessage);

module.exports = router;
