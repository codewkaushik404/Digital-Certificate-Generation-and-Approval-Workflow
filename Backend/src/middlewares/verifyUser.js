const jwt = require("jsonwebtoken");

function verifyUser(req, res, next){

    const header = req.headers.authorization;
    if(!header || !header.startsWith("Bearer ")){
       res.status(401).json({message: "User not authenticated"});
    }
    //const { token } = req.cookies.token;
    const token = header.split(" ")[1];
    if(!token){
        res.status(401).json({message: "User not authenticated"});
    }

    try{
        const decoded = jwt.verify(token, process.env.JWT_SECRET_TOKEN);
        req.user = decoded;
        console.log(jwt.decode(token));
        console.log(decoded);
        next();
    }catch(err){
        res.status(401).json({message: "Invalid token"});
    }
}

module.exports = verifyUser;