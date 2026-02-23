const nodemailer = require("nodemailer");
/**
 * WHY THIS? 
 * On localhost, your server is using a self-signed certificate, which means:
“I made this certificate myself, not a trusted authority.”
Node does not trust self-signed certificates by default, so it does: 
    I don’t trust this certificate, I’m stopping the connection to be safe.
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0"
Node has a rule: reject all untrusted certificates.
By setting this variable to 0, you’re telling Node:
    Hey, it’s okay — don’t check the certificate, just go ahead and trust it
So Node stops throwing the error and lets the connection continue.
*/

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

/*
SMTP = It’s the protocol used to send emails.
Nodemailer talks to Gmail’s SMTP server.

Your backend calls sendEmail()
Nodemailer connects to Gmail SMTP
Gmail authenticates using auth
Gmail sends the email to recipient
Your server is not sending email directly — Gmail is.

*/
const transport = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }  
})

async function sendEmail(email, link){
    const options = {
        from: `Certify Support Team <${process.env.EMAIL_USER}>`,
        to: email,
        subject: "Password Reset Request – Action Required",
        text: `
        Hello,
        We received a request to reset your password.
        If you initiated this request, please use the link below to set a new password:

        ${link}

        If you did not request a password reset, you can safely ignore this email.
        This link will expire in 10 minutes for security reasons.

        Regards,
        Certify Support Team
        `,
        html: `
                <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
                    <h2 style="color: #111;">Password Reset Request</h2>
                    <p>Hello,</p>
                    <p>We received a request to reset your password.</p>
                    <p>
                        Click the button below to set a new password. This link will expire in 
                        <strong>15 minutes</strong>.
                    </p>
                    <p style="margin: 20px 0;">
                        <a href="${link}" 
                        style="
                            background-color: #111;
                            color: #fff;
                            padding: 12px 20px;
                            text-decoration: none;
                            border-radius: 4px;
                            display: inline-block;
                        ">
                        Reset Password
                        </a>
                    </p>
                    <p>If you did not request this, you can safely ignore this email.</p>
                    <hr />
                    <p style="font-size: 12px; color: #777;">
                        This is an automated message. Please do not reply.
                    </p>
                </div>       
        ` 
    }

    const mail = await transport.sendMail(options);
    //console.log(mail);
}

module.exports = sendEmail;

