const jwt = require('jsonwebtoken');
const SECRET_KEY = '123456'; // Thay đổi với khóa bí mật của bạn

const verifyToken = (req, res, next) => {
    const token = req.cookies.token;

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
        console.log(decoded);
        next();
    });
};

const verifyRole = (role) => (req, res, next) => {
    if (req.user.userType !== role) {
        return res.status(403).json({
            errCode: 3,
            message: 'Permission denied!'
        });
    }
    next();
};

module.exports = { verifyToken, verifyRole };
