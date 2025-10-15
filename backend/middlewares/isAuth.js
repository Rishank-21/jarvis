import jwt from "jsonwebtoken";

export const isAuth = (req , res, next) => {
    try{
        const token = req.cookies.token || req.headers.authorization?.split(" ")[1];
    if(!token){
        return res.status(401).json({ message: "Not authorized, no token" });
    }
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if(err){
            return res.status(401).json({ message: "Not authorized, invalid token" });
        }
        req.user = decoded;
        next();
    });
    } catch (error) {
        return res.status(401).json({ message: "Not authorized" });
    }
}