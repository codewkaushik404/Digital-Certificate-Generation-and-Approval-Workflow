
const jwt = require("jsonwebtoken");

function sendResetToken(userId,email){
    const secret = userId + process.env.SECRET;
    const resetToken = jwt.sign({id: userId, email: email}, secret, {
        expiresIn: "10m"
    })
    return resetToken;
}

module.exports = sendResetToken;