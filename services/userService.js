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
    let [results, fields] = await connection.query(`select * from PAPERS u where paper_id = ?`, [PaperId]);
    let Paper = results && results.length > 0 ? results[0] : {};
    return results;

}


module.exports = {
    handleUserLogin: handleUserLogin, getPaperbyID
}