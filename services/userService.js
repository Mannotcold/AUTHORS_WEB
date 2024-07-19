const connection = require('../config/database')

let handleUserLogin = (username, password) => {

}

let checkusername = (username) => {
    return new Promise((resolve, reject) => {
        try {

        } catch (error) {
            reject(e);
        }
    })
}

const getPaperbyID = async (PaperId) => {
    let [results, fields] = await connection.query(`SELECT * FROM PAPERS WHERE paper_id = ?`, [PaperId]);
    let Paper = results && results.length > 0 ? results[0] : {};

    let [results1, fields1] = await connection.query(
        `SELECT 
            A.full_name
        FROM 
            PARTICIPATION P
        JOIN 
            AUTHORS A ON P.author_id = A.user_id
        WHERE 
            P.paper_id = ?`,
        [PaperId]
    );

    return { paper: Paper, authors: results1 };
}


const updatePaperbyID = async (username, password, type, userID) => {
    const [results, fields] = await connection.query(`UPDATE USERS SET taikhoan = ? , matkhau = ?, loaiTK = ? WHERE id = ?`, [username, password, type, userID]);
    let user = results && results.length > 0 ? results[0] : {};
    return user;
}


module.exports = {
    handleUserLogin: handleUserLogin, getPaperbyID, updatePaperbyID
}