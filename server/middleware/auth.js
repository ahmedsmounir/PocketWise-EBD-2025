const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
    // 1. Get the token from the header
    const token = req.header('auth-token');
    
    // 2. If no token, kick them out
    if (!token) return res.status(401).json("Access Denied: No Token Provided");

    try {
        // 3. Verify the token 
        // IMPORTANT: "SecretKey123" must match the key you used in routes/auth.js!
        const verified = jwt.verify(token, "SecretKey123");
        
        // 4. Attach user info to the request
        req.user = verified; 
        next(); // Let them pass
    } catch (err) {
        res.status(400).json("Invalid Token");
    }
};