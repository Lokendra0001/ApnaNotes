const jwt = require("jsonwebtoken");


const secretId = 'rakeshraj-021'

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

    res.cookie('token', token)
}

function getUser(token) {
    if (!token) return;

    const user = jwt.verify(token, secretId);
    return user;
}

module.exports = { generateTokenAndSetCookie, getUser };