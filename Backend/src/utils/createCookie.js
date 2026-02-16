const generateToken = require("./generateToken");
const jwt = require("jsonwebtoken");

function generateToken(payload){
     const token = jwt.sign(payload, process.env.JWT_SECRET_TOKEN, { expiresIn: "1h" });
     return token;
}

function createCookie(payload,res){

    const token = generateToken(payload);
    res.cookie("token", token, {
        maxAge: 60*60*1000,
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production"
    })
    return ;
}

module.exports = createCookie;
