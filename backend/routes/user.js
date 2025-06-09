const { Router } = require("express");
const multer = require("multer");
const { storage } = require("../utils/cloudinary");
const {
    handleLogout,
    handleSignIn,
    handleSignUp,
    handleGetProfile,
    handleEditProfile,
    handleChangeAvator,
} = require("../controllers/user.js");
const { checkAuthentication } = require("../middleware/auth.js");

const upload = multer({ storage });

const router = Router();

router.post("/signup", upload.single("profileImg"), handleSignUp);

router.post("/login", handleSignIn);

router.get("/logout", handleLogout);

router.get("/profile", checkAuthentication, handleGetProfile);

router.post("/editProfile", checkAuthentication, handleEditProfile);

router.post("/changeAvator", upload.single("profileImg"), handleChangeAvator);

module.exports = router;
