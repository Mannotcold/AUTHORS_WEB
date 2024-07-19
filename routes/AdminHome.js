var express = require('express');
// const verifyToken = require('../Controller/verifyToken')
const { getAdminpage, getRegisterpage, postRegisterpage, getedituserpage, postUpdatepage, postDeletepage } = require('../Controller/homeController')
var router = express.Router();
const { verifyToken, verifyRole } = require('../Controller/verifyToken');


// /* GET register page. */
router.get('/', verifyToken, verifyRole('admin'), getAdminpage);
router.get('/Register', verifyToken, verifyRole('admin'), getRegisterpage);
router.post('/Register/Create_user', postRegisterpage);
router.post('/edit_user/Update_user', postUpdatepage);
router.post('/delete_user/:id', postDeletepage);
router.get('/edit_user/:id', verifyToken, verifyRole('admin'), getedituserpage);
// router.post('/Register/Create_user', getRegisterpage);
module.exports = router;
