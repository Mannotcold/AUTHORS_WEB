const connection = require('../config/database')
const verifyToken = require('../Controller/verifyToken')
const jwt = require('jsonwebtoken');
const SECRET_KEY = '123456'; 

const { getPaperbyID } = require('../services/userService')



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

const getviewpaperpage = async function (req, res, next) {
    const PaperId = req.params.id;
    let paper = await getPaperbyID(PaperId);
    console.log(paper);
    res.render('DetailPaper.ejs', { paperview: paper });
}

module.exports = {
    handleLogin, getAuthurpage, getviewpaperpage
}