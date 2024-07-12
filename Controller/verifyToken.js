const jwt = require('jsonwebtoken');
const SECRET_KEY = '123456'; // Thay đổi với khóa bí mật của bạn

const verifyToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];

    if (!authHeader) {
        return res.status(403).json({
            errCode: 1,
            message: 'No token provided!'
        });
    }

    const token = authHeader.split(' ')[1]; // Tách token từ chuỗi 'Bearer <token>'

    if (!token) {
        return res.status(403).json({
            errCode: 1,
            message: 'No token provided!'
        });
    }

    jwt.verify(token, SECRET_KEY, (err, decoded) => {
        if (err) {
            return res.status(500).json({
                errCode: 2,
                message: 'Failed to authenticate token.'
            });
        }

        // Nếu token hợp lệ, lưu thông tin người dùng vào req và chuyển sang middleware tiếp theo
        req.user = decoded;
        next();
    });
};

module.exports = verifyToken;