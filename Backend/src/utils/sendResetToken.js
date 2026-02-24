
const jwt = require("jsonwebtoken");

function sendResetToken(userId){
    const resetToken = jwt.sign({id: userId}, process.env.RESET_TOKEN_SECRET, {
        expiresIn: "10m"
    })
    return resetToken;
}

module.exports = sendResetToken;