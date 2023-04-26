const promiseRouter = require("express-promise-router");
const router = promiseRouter();
const { getHome } = require("../controllers/homeController");

router.get("/home", getHome);

module.exports = router;
