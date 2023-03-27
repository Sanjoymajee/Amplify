const promiseRouter = require("express-promise-router");
const router = promiseRouter();
const {
  getLogin,
  getSignup,
  getGoogle,
  getGoogleCallback,
  postSignup,
  postLogin,
  postLogout,
} = require("../controllers/authController");

router.get("/auth/login", getLogin);

router.get("/auth/signup", getSignup);

// Google Oauth GET route
router.get("/auth/google", getGoogle);

// Google Oauth callback route
router.get("/auth/google/callback", getGoogleCallback);

// Sign up route using Passport and failureFlash option
router.post("/auth/signup", postSignup);

router.post("/auth/login", postLogin);

router.post("/auth/logout", postLogout);

module.exports = router;
