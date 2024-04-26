const jwt = require('jsonwebtoken');

const AuthenticateUser = (req, res, next) => {
    let { token } = req.cookies;
    if (!token) {
        return res.status(400).json({ error: 'Invalid credentials' });
    }
    try {
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        // console.log(decodedToken);
        // Attach the user to the request object
        if (!decodedToken) {
            return res.status(400).json({ error: "Invalid credentials" })
        }
        req.user = decodedToken;
        next();

    } catch (error) {
        console.log(error?.message)
        return res.status(400).json(error?.message);
    }
}


module.exports = AuthenticateUser;