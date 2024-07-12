const connection = require('../config/database')
const { getTopic, getAllPaper, searchPapers, getAllUsers, getUserbyID, updateUserbyID, DeleteUserbyID } = require('../services/CRUDServives')


const getHomepage = async function (req, res, next) {
    let topics = await getTopic();
    res.render('Home.ejs', { topic1: topics.topic1, topic2: topics.topic2 });
}

const getPaperSearchpage = async function (req, res, next) {
    try {
        let results = await getAllPaper();
        let selectedCategory = req.body.category; // Lấy giá trị từ req.body.category, không phải req.body.Category
        console.log('Selected Category:', selectedCategory);
        res.render('PaperSearch.ejs', { listPaper: results });
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



const getLoginpage = function (req, res, next) {
    res.render('Login.ejs');
}

const getAdminpage = async function (req, res, next) {
    let results = await getAllUsers();
    res.render('admin.ejs', { listusers: results });
}

const getedituserpage = async function (req, res, next) {
    const userId = req.params.id
    let user = await getUserbyID(userId);
    res.render('edituser.ejs', { userEdit: user });
}

const postUpdatepage = async function (req, res, next) {
    let userID = req.body.userID;
    let username = req.body.username;
    let password = req.body.password;
    let type = req.body.type;

    // console.log(">>>req.body: ", username, password, type);

    // const [results, fields] = await connection.query(`UPDATE Users SET taikhoan = ? , matkhau = ?, loaiTK = ? WHERE id = ?`, [username, password, type, userID]);
    // console.log(">>>req.body: ", results);
    let updateuser = await updateUserbyID(username, password, type, userID);
    res.redirect(`/`)
}

const postDeletepage = async function (req, res, next) {
    // let userID = req.body.userID;
    let userID = req.params;
    // const id = userID;
    // const [results, fields] = await connection.query(`UPDATE Users SET taikhoan = ? , matkhau = ?, loaiTK = ? WHERE id = ?`, [username, password, type, userID]);
    // console.log(">>>req.body: ", results);
    let updateuser = await DeleteUserbyID(userID);
    res.redirect(`/adminhome`)
}


const getRegisterpage = function (req, res, next) {
    res.render('register.ejs');
    // res.send('sâsffsa');
}

const postRegisterpage = async function (req, res, next) {

    let username = req.body.username;
    let password = req.body.password;
    let type = req.body.type;

    // let [username, password, type ]  = req.body;

    // with placeholder
    // connection.query(
    //     `INSERT INTO Users (taikhoan, matkhau, loaiTK) VALUES (?, ?, ?)`,
    //     [username, password, type],
    //     function (err, results) {
    //         console.log(results);
    //         res.send('thanh cong');
    //     }
    // );
    // const [results, fields] = connection.query(
    //     `INSERT INTO Users (taikhoan, matkhau, loaiTK) VALUES (?, ?, ?)`,
    //     [username, password, type]
    // );

    // console.log(">>>req.body: ", username, password, type);

    const [results, fields] = await connection.query(
        'INSERT INTO Users (taikhoan, matkhau, loaiTK) VALUES (?, ?, ?)',
        [username, password, type]
    );
    console.log(">>>req.body: ", results);
    res.send('thanh cong');
    // res.send('sâsffsa');
}



let user = [];
const getProductpage = (req, res) => {
    connection.query(
        'select * from Users u',
        function (err, results, fields) {
            users = results;
            // console.log(">>>results home page= ", results);
            console.log(">> check users: ", users);
            res.send(JSON.stringify(users));
            // res.send('sâsffsa');

        }
    );

}

module.exports = {
    getHomepage, getPaperSearchpage, getProductpage, getLoginpage, getRegisterpage,
    postRegisterpage, getAdminpage, getedituserpage, postUpdatepage, postDeletepage, getSearch
}