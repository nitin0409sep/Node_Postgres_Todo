const jwt = require('jsonwebtoken');

module.exports.jwtTokens = ({ unique_id, email, user_name }) => {
    const user = { unique_id, email, user_name };

    const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '350h' })
    const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '5m' })

    return { accessToken, refreshToken };
}
