var express = require('express');
// const verifyToken = require('../Controller/verifyToken')
const { getAuthurpage, getviewpaperpage } = require('../Controller/userController')
var router = express.Router();



// /* GET register page. */
router.get('/', getAuthurpage);
router.get('/view_paper/:id', getviewpaperpage);

// router.post('/Register/Create_user', getRegisterpage);
module.exports = router;
