const jwt = require("jsonwebtoken");

// Create Token and saving in cookie
const JWT_SECRET = process.env.JWT_SECRET;
const getJWTToken = (id) => {
    return jwt.sign({ id: id }, JWT_SECRET, {
        expiresIn: "5d",
    });
};

const sendToken = (user, statusCode, res) => {
    const token = getJWTToken(user.id);

    // options for cookie
    const options = {
        expires: new Date(
            Date.now() + 5 * 24 * 60 * 60 * 1000
        ),
        httpOnly: true,
    };

    res.status(statusCode).cookie("token", token, options).json({
        success: true,
        user,
        token,
    });
};

module.exports = sendToken;
