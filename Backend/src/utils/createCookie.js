const generateToken = require("./generateToken");

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
