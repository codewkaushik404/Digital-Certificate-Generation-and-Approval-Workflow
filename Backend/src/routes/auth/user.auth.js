const router = require("express").Router();
const { login, logout, register, onboarding, forgotPassword } = require("../../controllers/auth/userAuthController");
const verifyUser = require("../../middlewares/verifyUser");
const passport = require("../../config/passport");

//POST   /auth/login
router.post("/login",login);

//POST   /auth/register
router.post("/register",register);

/**
 * GOOGLE AUTHENTICATION USING OAuth
 * FLow:
 * 1. Client sends authorization request by hitting /google endpoint 
 * 2. User is redirected to google consent screen (where scope or resource it wants to access is listed)
 * 3. User reads and click Allow 
 * 4. Google Auth Server redirects to redirect URI
 * 5. Authorization code is obtained 
 * 6. /google/callback will send a req to auth server for access token
 * 7. If u are using oauth just to sign in then after getting access Token it is nowhere used/useless
 * 8. code is exchanged for token 
 * 9. verify callback fn (function(accessToken, refreshToken, profile, cb) ) will run
 * 10. cb(null, user) -> successfull authentication cb(err, null) -> error in auth
 * 11. then the other fn (req, res) will run where user data is made available in req.user
 * 12. If u are using jwt based authentication then keep session: false
 */

// GET auth/google
router.get("/google", passport.authenticate('google', { scope: ["profile", "email"]}))

// GET auth/google/callback
router.get("/google/callback", function(req, res){
    passport.authenticate("google", (err, user, info)=>{
        if(err){
            console.error("Google OAuth error:", err);
            return res.redirect(`${process.env.FRONTEND_URL}/login?error=oauth_failed`);
        }

        if(!user) {
            console.error("Google OAuth failed:", info?.message);
            return res.redirect(`${process.env.FRONTEND_URL}/login?error=authentication_failed`);
        }

        req.login(user, (err)=>{
            if(err){
                console.error("Error establishing session:", err);
                return res.redirect(`${process.env.FRONTEND_URL}/login?error=session_failed`);
            }

            // Redirect based on onboarding status
            // The frontend will check auth status and redirect accordingly
            if(!user.onboardingComplete) {
                return res.redirect(`${process.env.FRONTEND_URL}/onboarding`);
            }
            return res.redirect(`${process.env.FRONTEND_URL}`);
        })

    })(req, res);
})

router.put("/onboarding", verifyUser, onboarding);

//DELETE  /auth/logout
//router.delete("/logout", verifyUser, logout);
router.delete("/logout", verifyUser, logout);

router.post("/forgot-password",forgotPassword);

//GET /api/v1/auth/me -> to check if user is authenticated or not for protected routes
router.get("/me", verifyUser, (req, res)=>{
    // Return user data similar to login response

    const {name, onboardingComplete, _id} = req.user;
    return res.json({
        message: "User is authenticated", 
        success: true,
        data: {
            name, 
            onboardingComplete: onboardingComplete || false,
            id: _id?.toString()
        }
    });
})

module.exports = router;