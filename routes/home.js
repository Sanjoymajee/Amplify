const promiseRouter = require("express-promise-router");
const router = promiseRouter();
const { getHome } = require("../controllers/homeController");

router.get("/", (req, res) => {
  res.redirect("/home");
});

router.get("/home", getHome);

module.exports = router;
