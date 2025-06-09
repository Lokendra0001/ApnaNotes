const { getUser } = require("../utils/auth.js");

const checkAuthentication = (req, res, next) => {
    req.user = null;
    const token = req.cookies?.token;
    if (!token) return res.status(401).json({ error: 'Please login first' });

    const user = getUser(token);
    if (!user) return res.status(401).json({ error: 'Invalid token, please login again' });

    req.user = user;
    next();
};


module.exports = { checkAuthentication }