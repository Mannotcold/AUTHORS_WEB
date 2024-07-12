var express = require('express');
const { getLoginpage } = require('../Controller/homeController')
const { handleLogin } = require('../Controller/userController')
var router = express.Router();

// /* GET login page. */
router.get('/', getLoginpage);
router.post('/api/login', handleLogin );
// router.get('/register', getRegisterpage);
module.exports = router;
