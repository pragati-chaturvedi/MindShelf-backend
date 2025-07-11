// backend/middleware/authMiddleware.js
const admin = require("../helpers/firebaseAdmin");

const verifyFirebaseToken = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader?.startsWith("Bearer ")) {
            return res.status(401).send("Unauthorized - No token");
        }

        const token = authHeader.split("Bearer ")[1];
        const decoded = await admin.auth().verifyIdToken(token);

        req.userId = decoded.uid;
        next();
    } catch (error) {
        console.error("Token verification failed:", error);
        res.status(403).send("Unauthorized");
    }
};

module.exports = verifyFirebaseToken;
