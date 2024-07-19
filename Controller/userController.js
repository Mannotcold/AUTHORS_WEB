const connection = require('../config/database')
const verifyToken = require('../Controller/verifyToken')
const express = require('express');
const session = require('express-session');
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
        if (results.length === 0) {
            return res.status(404).json({
                errCode: 2,
                message: 'User not found!'
            });
        }

        let user = results[0];
        // So sánh mật khẩu
        if (password !== user.password) {
            return res.status(401).json({
                errCode: 3,
                message: 'Incorrect password!'
            });
        }

        // Tạo JWT
        let token = jwt.sign(
            {
                userId: user.user_id,
                username: user.username,
                userType: user.user_type
            },
            SECRET_KEY,
            { expiresIn: '1h' }
        );

        // Lưu token vào cookie
        res.cookie('token', token, {
            httpOnly: true, // Ngăn chặn truy cập từ client-side JavaScript
            secure: false, // Đặt thành true nếu sử dụng HTTPS
            sameSite: 'strict' // Ngăn chặn các yêu cầu từ các trang web khác
        });

        if (user.user_type === "admin") {
            return res.redirect('/adminhome');
        }
        if (user.user_type === "member") {
            return res.redirect('/AuthurHome');
        }

        return res.status(200).json({
            errCode: 0,
            message: 'Login successful!'
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({
            errCode: 4,
            message: 'Internal server error!'
        });
    }
};



const getAuthurpage = async function (req, res, next) {

    const userId = req.user.userId;

    try {
        // Lấy thông tin profile của tác giả
        const [authorProfile] = await connection.query('SELECT * FROM AUTHORS WHERE user_id = ?', [userId]);

        if (authorProfile.length === 0) {
            return res.status(404).json({ message: 'Author not found!' });
        }
        console.log('frofile', authorProfile);
        // Lấy danh sách các bài báo của tác giả
        const papers = await connection.query(`
            SELECT PAPERS.*, PARTICIPATION.date_added 
            FROM PAPERS 
            JOIN PARTICIPATION ON PAPERS.paper_id = PARTICIPATION.paper_id 
            WHERE PARTICIPATION.author_id = ? 
            ORDER BY PARTICIPATION.date_added DESC
        `, [userId]);

        // Chuyển hướng đến trang thông tin tác giả
        res.render('AuthurHome.ejs', {
            author: authorProfile[0],
            papers: papers[0]
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal server error!' });
    }
    // res.render('AuthurHome.ejs');
    // res.render('AuthurHome.ejs', {
    //     userId: req.user.userId,
    //     username: req.user.username,
    //     userType: req.user.userType
    // }); có thể truyền biên vào ui luôn
}

const geteditauthor = async function (req, res, next) {
    const userId = req.params.id;

    try {
        // Lấy thông tin profile của tác giả
        const [authorProfile] = await connection.query('SELECT * FROM AUTHORS WHERE user_id = ?', [userId]);

        if (authorProfile.length === 0) {
            return res.status(404).json({ message: 'Author not found!' });
        }

        // Chuyển hướng đến trang thông tin tác giả
        res.render('editAuthor.ejs', {
            author: authorProfile[0]
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal server error!' });
    }
}

const postupdateAuthor = async function (req, res, next) {
    const authorId = req.params.id;
    const { full_name, website, bio, interests } = req.body;
    let profileJsonText = JSON.stringify({ bio, interests: interests.split(',').map(item => item.trim()) });
    let image_path = req.body.image_path;

    if (req.file) {
        image_path = '/uploads/' + req.file.filename; // Lưu đường dẫn ảnh mới
    }
    const [authorProfile] = await connection.query('UPDATE AUTHORS SET full_name = ?, website = ?, profile_json_text = ?, image_path = ? WHERE user_id = ?',
        [full_name, website, profileJsonText, image_path, authorId]);

    res.redirect('/AuthurHome');
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
    res.render('UpdatePaper.ejs', { topic1: paper.paper, topic2: paper.authors });
}
const postUpdatepage = async function (req, res, next) {
    let PaperID = req.body.paper_id;
    let Author = req.body.author_string_list;

    console.log(">>>req.body: ", PaperID, Author);

    const [results, fields] = await connection.query(`UPDATE PAPERS SET author_string_list = ? WHERE paper_id = ?`, [Author, PaperID]);
    console.log(">>>req.body: ", results);


    return res.redirect('/AuthurHome/PaperSearchAuthur')
    // // let updateuser = await updateUserbyID(paper_id);
    // res.redirect(`/`)
}

const postremovepage = async function (req, res, next) {
    let authorId = req.body.author_id;
    let paperId = req.body.paper_id;

    try {
        const [results, fields] = await connection.query(`DELETE FROM PARTICIPATION WHERE author_id = ? AND paper_id = ?`, [authorId, paperId]);
        console.log("Remove Results: ", results);

        return res.redirect('/AuthurHome/PaperSearchAuthur');
    } catch (error) {
        console.error("Error removing author: ", error);
        return res.status(500).json({
            errCode: 4,
            message: 'Internal server error!'
        });
    }
}


const postaddPaper = async function (req, res, next) {
    const { title, author_string_list, abstract, conference_id, topic_id } = req.body;
    const authors = req.body.author_id;
    const roles = req.body.role;
    console.log(">>>req.body: ", title, author_string_list, abstract, conference_id, topic_id, authors, roles);

    try {
        // Bắt đầu một giao dịch
        await connection.query('START TRANSACTION');



        // Thêm các tác giả vào bảng PARTICIPATION
        for (let i = 0; i < authors.length; i++) {
            const author_id = authors[i];
            const role = roles[i];

            // Thêm bài báo vào bảng PAPERS
            const [paperResult] = await connection.query(
                'INSERT INTO PAPERS (title, author_string_list, abstract, conference_id, topic_id, user_id) VALUES (?, ?, ?, ?, ?, ?)',
                [title, author_string_list, abstract, conference_id, topic_id, authors[i]]
            );

            const paper_id = paperResult.insertId;
            await connection.query(
                'INSERT INTO PARTICIPATION (author_id, paper_id, role, date_added, status) VALUES (?, ?, ?, NOW(), ?)',
                [author_id, paper_id, role, 'show']
            );
        }

        // Commit giao dịch
        await connection.query('COMMIT');
        res.send('Paper added successfully!');
    } catch (err) {
        // Rollback giao dịch trong trường hợp lỗi
        await connection.query('ROLLBACK');
        console.error(err);
        res.status(500).send('An error occurred while adding the paper.');
    }
}



module.exports = {
    postremovepage, handleLogin, getAuthurpage, getviewpaperpage, getUpdatepaperpage, PaperSearchAuthur, postUpdatepage, getSearch, getCreatePaper, postaddPaper, geteditauthor, postupdateAuthor
}