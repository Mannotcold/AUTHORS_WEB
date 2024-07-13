const connection = require('../config/database')


const getTopic = async () => {
    let [results1, fields1] = await connection.query(`select * from PAPERS where topic_id = ?`, ["1"]);
    let [results2, fields2] = await connection.query(`select * from PAPERS where topic_id = ?`, ["2"]);

    return { topic1: results1, topic2: results2 };
}

const getAllPaper = async () => {
    let [results, fields] = await connection.query(`select * from PAPERS p`);
    return results;

}

async function searchPapers(keyword, category) {

    if (category === "title") {
        let query = "SELECT * FROM PAPERS WHERE title LIKE ?";
        let params = [`%${keyword}%`];
        let [results, fields] = await connection.query(query, params); // db.query là hàm thực hiện truy vấn SQL trong database

        return results;
    }

    if (category === "abstract") {
        let query = "SELECT * FROM PAPERS WHERE abstract LIKE ?";
        let params = [`%${keyword}%`];
        let [results, fields] = await connection.query(query, params); // db.query là hàm thực hiện truy vấn SQL trong database

        return results;
    }

    if (category === "abstract") {
        let query = "SELECT * FROM PAPERS WHERE author_string_list LIKE ?";
        let params = [`%${keyword}%`];
        let [results, fields] = await connection.query(query, params); // db.query là hàm thực hiện truy vấn SQL trong database

        return results;
    }

}


const getTopic2 = async () => {
    let [results, fields] = await connection.query(`select * from PAPERS where topic_id = ?`, ["2"]);
    // let [results2, fields2] = await connection.query(`select * from PAPERS where topic_id = ?`, ["2"]);

    return results;
}



const getAllUsers = async () => {
    let [results, fields] = await connection.query(`select * from USERS u `);
    return results;
}


const getUserbyID = async (userId) => {
    let [results, fields] = await connection.query(`select * from USERS u where user_id = ?`, [userId]);
    
    let user = results && results.length > 0 ? results[0] : {};

    return user;
}

const updateUserbyID = async (username, password, type, userID) => {
    const [results, fields] = await connection.query(`UPDATE USERS SET taikhoan = ? , matkhau = ?, loaiTK = ? WHERE id = ?`, [username, password, type, userID]);
    let user = results && results.length > 0 ? results[0] : {};
    return user;
}

const DeleteUserbyID = async (userID) => {

    const [results, fields] = await connection.query(`DELETE FROM Users WHERE id = ?`, [userID.id]);
    // let user = results && results.length > 0 ? results[0] : {};
    // return user;
}


module.exports = {
    getTopic, getAllPaper, getTopic2, getAllUsers, getUserbyID, updateUserbyID, DeleteUserbyID, searchPapers
}