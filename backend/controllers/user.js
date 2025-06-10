const User = require('../models/user');
const { generateTokenAndSetCookie } = require("../utils/auth.js");

const handleSignUp = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        const profileImgPath = req.file.path;

        const user = await User.create({
            username,
            email,
            password,
            profileImg: profileImgPath,
        });

        return res.status(201).json({ message: "User signed up successfully", user });
    } catch (err) {
        res.status(500).json({ error: "Signup failed" });
    }
};

const handleSignIn = async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email });
    if (!user) return res.status(404).json({ error: "User Not Found!" });

    const isVerified = await User.verifyPassword(user, password);
    if (!isVerified) return res.status(404).json({ error: "Invalid Password!" });

    generateTokenAndSetCookie(res, user);

    return res.status(201).json({ message: "Login Successfully!" });
}


const handleLogout = async (req, res) => {
    res.clearCookie('token', {
        httpOnly: true,
        secure: true,         // Needed for HTTPS in production (like Render)
        sameSite: "None",     // Required for cross-origin cookies
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });


    return res.status(200).json({ message: "Logout successful" });
};

const handleGetProfile = async (req, res) => {
    const userId = req.user.id;
    const user = await User.findOne({ _id: userId });
    res.status(200).json({ user });
};

const handleEditProfile = async (req, res) => {
    const { username, email, bio } = req.body;
    const user_id = req.user.id;
    await User.findOneAndUpdate({ _id: user_id }, { username, email, bio });
    res.status(200).json({ message: "Bio update Successfully" })
};

const handleChangeAvator = async (req, res) => {
    const { user_id } = req.body;
    const profileImg = req.file.path;
    await User.findOneAndUpdate({ _id: user_id }, { profileImg: profileImg })
    res.json({ msg: "Avator Updataed" })
};

module.exports = {
    handleSignUp,
    handleSignIn,
    handleLogout,
    handleGetProfile,
    handleEditProfile,
    handleChangeAvator
}