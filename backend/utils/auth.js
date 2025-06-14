const jwt = require("jsonwebtoken");


const secretId = process.env.JWT_SECRET_ID;

function generateTokenAndSetCookie(res, user) {
    const payload = {
        id: user._id,
        username: user.username,
        email: user.email,
        profileImg: user.profileImg,
        bio: user.bio,
        createdAt: user.createdAt
    }
    const token = jwt.sign(payload, secretId)

    res.cookie('token', token, {
        httpOnly: true,
        secure: true,         // Needed for HTTPS in production (like Render)
        sameSite: "None",     // Required for cross-origin cookies
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });
}

function getUser(token) {
    if (!token) return;

    const user = jwt.verify(token, secretId);
    return user;
}

module.exports = { generateTokenAndSetCookie, getUser };