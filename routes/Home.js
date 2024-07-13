var express = require('express');
const { getHomepage, getProductpage, getSearch, getPaperSearchpage } = require('../Controller/homeController')
var router = express.Router();
const { getviewpaperpage } = require('../Controller/userController')

/* GET home page. */
router.get('/', getHomepage);
router.get('/SearchPaper', getPaperSearchpage);
router.get('/SearchPaper/view/:id', getviewpaperpage);
router.get('/Search', getSearch);
// router.post('/Create_user', getProductpage);
module.exports = router;


