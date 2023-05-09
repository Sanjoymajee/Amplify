const promiseRouter = require("express-promise-router");
const router = promiseRouter();
const { checkUsername } = require("../controllers/ajaxController");

router.get("/check-username", checkUsername);

module.exports = router;
