const jwt = require("jsonwebtoken")
const authMiddleware = (req,res,next)=>{
    try {
        console.log("Auth middleware called");
        const authHeader = req.header("Authorization")
        
        if(!authHeader){
            return res.status(401).json({message:"Access denied. No token provided"})
        }
        const token = authHeader.replace("Bearer ","")
        const decode = jwt.verify(
            token,
            process.env.JWT_SECRET
        )
        req.user=decode
        next()
    } catch (error) {
        res.status(401).json({message:"Invalid token"})
    }
}
module.exports = {authMiddleware}