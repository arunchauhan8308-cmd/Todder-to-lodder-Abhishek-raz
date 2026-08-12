const jwt = require('jsonwebtoken');

exports.generateToken = (user) => {
    
    const payload = {
        id: user._id,        
        role: user.role       
    };

    const SECRET_KEY = process.env.JWT_STR

    const options = {
        expiresIn: '7d' 
    };

    const token = jwt.sign(payload, SECRET_KEY, options);
    
    return token;
};

exports.authenticateUser = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ success: false, message: "No token provided, access denied" });
        }

        const token = authHeader.split(' ')[1];

        const decoded = jwt.verify(token, process.env.JWT_STR);

        req.user = decoded;

        next();

    } catch (error) {
        return res.status(401).json({ 
            success: false, 
            message: "Invalid or expired token" 
        });
    }
};