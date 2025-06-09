const express = require("express");
const { checkAuthentication } = require("../middleware/auth.js");

const router = express.Router();

router.get("/check-auth", checkAuthentication, (req, res) => {
    res.json({ loggedIn: true, user: req.user });
});

module.exports = router;
