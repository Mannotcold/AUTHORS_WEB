const connection = require('../config/database')
const verifyToken = require('../Controller/verifyToken')
const jwt = require('jsonwebtoken');
const SECRET_KEY = '123456'; 

const { getPaperbyID, updateUserbyID } = require('../services/userService')
const { getAllPaper, searchPapers } = require('../services/CRUDServives')



let handleLogin = async (req, res) => {
    let username = req.body.username;
    let password = req.body.password;

    if (!username || !password) {
        return res.status(500).json({
            errCode: 1,
            message: 'Missing inputs parameter!'
        });
    }

    try {
        // Kiểm tra username có tồn tại trong cơ sở dữ liệu
        let [results, fields] = await connection.query('SELECT * FROM USERS WHERE username = ?', [username]);
        console.log(results.length);
        console.log(results);
        if (results.length === 0) {
            console.log(results);
            return res.status(404).json({
                errCode: 2,
                message: 'User not found!'
            });
        }

        // results = results[0];
        let user = results[0].password;
        // So sánh mật khẩu
        if (password !== results[0].password) {
            return res.status(401).json({
                errCode: 3,
                message: 'Incorrect password!'
            });
        }

        // Tạo JWT
        let token = jwt.sign(
            {
                userId: results[0].user_id,
                username: results[0].username,
                userType: results[0].user_type
            },
            SECRET_KEY,
            { expiresIn: '1h' }
        );

        if (results[0].user_type === "admin") {
            console.log(token);
            return res.redirect(`/adminhome`);
        }
        if (results[0].user_type === "member") {
            return res.redirect(`/`)
        }

        // return res.status(200).json({
        //     errCode: 0,
        //     message: 'Login successful!',
        //     access_token: token
        // });
    } catch (err) {
        console.error(err);
        return res.status(500).json({
            errCode: 4,
            message: 'Internal server error!'
        });
    }
}

const getAuthurpage = async function (req, res, next) {
    res.render('AuthurHome.ejs');
}

const getCreatePaper = async function (req, res, next) {
    res.render('CreatePaper.ejs');
}

const PaperSearchAuthur = async function (req, res, next) {
    try {
        let results = await getAllPaper();
        let selectedCategory = req.body.category; // Lấy giá trị từ req.body.category, không phải req.body.Category
        console.log('Selected Category:', selectedCategory);
        res.render('PaperSearchAuthur.ejs', { listPaper: results });
    } catch (error) {
        console.error('Error retrieving papers:', error);
        next(error);
    }
}

const getSearch = async function (req, res, next) {
    try {
        let keyword = req.query.keyword; // Lấy từ khoá tìm kiếm từ query params
        let category = req.query.category; // Lấy giá trị category từ query params
        let results = await searchPapers(keyword, category); // Hàm searchPapers sẽ thực hiện truy vấn tìm kiếm dựa trên từ khoá và category
        console.log(results);
        // // Trả về dữ liệu dưới dạng HTML fragment để render trong trang HTML
        res.render('paperList.ejs', { listPaper: results }, (err, html) => {
            if (err) {
                console.error('Error rendering paper list:', err);
                res.status(500).send('Error rendering paper list');
            } else {
                res.send(html);
            }
        });
    } catch (error) {
        console.error('Error retrieving papers:', error);
        next(error);
    }
}

const getviewpaperpage = async function (req, res, next) {
    const PaperId = req.params.id;
    let paper = await getPaperbyID(PaperId);
    console.log(paper);
    res.render('DetailPaper.ejs', { paperview: paper });
}

const getUpdatepaperpage = async function (req, res, next) {
    const PaperId = req.params.id;
    let paper = await getPaperbyID(PaperId);
    console.log(paper);
    res.render('UpdatePaper.ejs', { paperview: paper });
}

const postUpdatepage = async function (req, res, next) {
    let PaperID = req.body.paper_id;
    let Author = req.body.author_string_list;

    // console.log(">>>req.body: ", username, password, type);

    const [results, fields] = await connection.query(`UPDATE PAPERS SET author_string_list = ? WHERE paper_id = ?`, [Author, PaperID]);
    console.log(">>>req.body: ", results);
    // let updateuser = await updateUserbyID(paper_id);
    res.redirect(`/`)
}

module.exports = {
    handleLogin, getAuthurpage, getviewpaperpage, getUpdatepaperpage, PaperSearchAuthur, postUpdatepage, getSearch, getCreatePaper
}