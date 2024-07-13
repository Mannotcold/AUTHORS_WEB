var express = require('express');
// const verifyToken = require('../Controller/verifyToken')
const { getAdminpage, getRegisterpage, postRegisterpage, getedituserpage, postUpdatepage, postDeletepage } = require('../Controller/homeController')
var router = express.Router();


// /* GET register page. */
router.get('/', getAdminpage);
router.get('/Register', getRegisterpage);
router.post('/Register/Create_user', postRegisterpage);
router.post('/edit_user/Update_user', postUpdatepage);
router.post('/delete_user/:id', postDeletepage);
router.get('/edit_user/:id', getedituserpage);

// router.post('/Register/Create_user', getRegisterpage);
module.exports = router;
