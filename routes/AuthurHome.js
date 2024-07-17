var express = require('express');
var path = require('path');
// const verifyToken = require('../Controller/verifyToken')
const { getAuthurpage, geteditauthor, postupdateAuthor, getUpdatepaperpage, PaperSearchAuthur, postUpdatepage, getCreatePaper, postaddPaper } = require('../Controller/userController')
var router = express.Router();
const { verifyToken, verifyRole } = require('../Controller/verifyToken');

const multer = require('multer');

// Định nghĩa đường dẫn lưu trữ ảnh
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/uploads/'); // Thư mục để lưu trữ ảnh upload
    },
    filename: function (req, file, cb) {
        // Lấy id từ request (ví dụ: req.params.id)
        const userId = req.params.id; // Đổi thành user_id hoặc paper_id tùy theo trường hợp

        // Tạo tên file mới
        const extension = path.extname(file.originalname); // Lấy phần mở rộng của file (ví dụ: .jpg)
        const newFilename = userId + '_' + Date.now() + extension;

        cb(null, newFilename);
    }
});
const upload = multer({ storage: storage });



// /* GET register page. */
router.get('/', verifyToken, verifyRole('member'), getAuthurpage);
router.get('/PaperSearchAuthur', verifyToken, verifyRole('member', 'admin'), PaperSearchAuthur);
router.get('/PaperSearchAuthur/SearchPaper/:id', getUpdatepaperpage);
router.post('/PaperSearchAuthur/Update_Paper', postUpdatepage);

router.get('/CreatePaper', getCreatePaper);

router.post('/CreatePaper/add', postaddPaper);
router.get('/edit/:id', geteditauthor);
router.post('/update/:id', upload.single('profileImage'), postupdateAuthor);
// router.get('/edit_user/:id', getedituserpage);

// router.post('/Register/Create_user', getRegisterpage);
module.exports = router;
