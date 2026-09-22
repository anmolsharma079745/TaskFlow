const roleMiddleware = (...allowedRoles) => {
    return (req,res,next)=>{
        if(!req.user){
            return res.status(401).json({
                message:"Unauthorized. Please login first."
            })
        }
        if(!allowedRoles.includes(req.user.role)){
            return res.status(403).json({
                message:"Access denied. Yoy do not have permissions."
            })
        }
        next();
    }
}
module.exports = roleMiddleware;