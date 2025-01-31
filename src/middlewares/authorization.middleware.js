const jwt = require('jsonwebtoken');

module.exports.authenticateUser = (req, res, next) => {
    const authHeader = req.headers['authorization']; // Bearer Token
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) return res.status(401).json({ error: 'Token is NULL' });

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, ((err, user) => {
        if (err) return res.status(403).json({ error: err.message });

        req.user = user;
        next();
    }));
}
