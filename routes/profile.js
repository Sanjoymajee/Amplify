const promiseRouter = require('express-promise-router');
const router = promiseRouter();
const {
    getUserProfile,
} = require('../controllers/profileController');

router.get('/profile/:profileUsername', getUserProfile);

module.exports = router;