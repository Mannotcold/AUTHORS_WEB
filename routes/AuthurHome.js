var express = require('express');
// const verifyToken = require('../Controller/verifyToken')
const { getAuthurpage, getUpdatepaperpage, PaperSearchAuthur, postUpdatepage, getCreatePaper } = require('../Controller/userController')
var router = express.Router();



// /* GET register page. */
router.get('/', getAuthurpage);
router.get('/PaperSearchAuthur', PaperSearchAuthur);
router.get('/PaperSearchAuthur/SearchPaper/:id', getUpdatepaperpage);
router.post('/PaperSearchAuthur/Update_Paper', postUpdatepage);

router.get('/CreatePaper', getCreatePaper);

// router.get('/edit_user/:id', getedituserpage);

// router.post('/Register/Create_user', getRegisterpage);
module.exports = router;
