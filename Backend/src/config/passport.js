const GoogleStrategy = require('passport-google-oauth20').Strategy;
const LocalStrategy = require("passport-local").Strategy;
const passport = require('passport');
const User = require("../models/User");
const { loginValidate } = require('../utils/authValidator');
const bcrypt = require("bcrypt");

//const passport = require("passport");

/**
 * new GoogleStrategy({options}, VERIFY_fn)
 */

/**
 * profile obj = {
*   id,
    displayName,
    name: {
        givenName,
        familyName
    },
    
    email obj = [{ value, verified }]}
 * 
 */

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET  = process.env.GOOGLE_CLIENT_SECRET;
const CALLBACK_URL = process.env.GOOGLE_CALLBACK_URL || `http://localhost:${process.env.PORT}/api/v1/auth/google/callback`  

passport.use(new GoogleStrategy({
    clientID: GOOGLE_CLIENT_ID,
    clientSecret: GOOGLE_CLIENT_SECRET,
    callbackURL: CALLBACK_URL
}, async function(accessToken, refreshToken, profile, cb) {
        try{
            //console.log("Access Token", accessToken);
            //console.log("Google profile: ", profile);
            const primaryEmail = profile.emails?.[0]?.value;
            if (!primaryEmail) {
                return cb(null, false, {message: "Email not found"} );
            }
            const user = await User.findOne({email: primaryEmail});
            if(user){
                if(!user.googleId){
                    user.googleId = profile.id;
                    user.strategy.push("google");
                    await user.save();
                }
                return cb(null, user);
            }

            const newUser = await User.create({
                name: profile.displayName,
                email: primaryEmail,
                googleId: profile.id,
                strategy: ["google"],
                onboardingComplete: false
            });                
            //console.log(newUser);
            return cb(null, newUser);
        }catch(err){
            console.error(err);
            return cb(err, null);
        }
    }
));

passport.use(new LocalStrategy(
    { usernameField: "email"},
    async function(email, password, cb){
    try{
        const validation = loginValidate.safeParse({email, password});
        if(!validation.success){
            const errors = validation.error.issues.map(issue => issue.message);
            return cb(null, false, {message: errors.join(", ")});
        }

        const user = await User.findOne({email: email});
        if(!user) {
            return cb(null, false, {message: "Invalid user credentials"});
        }

        if(!user.strategy.includes("local") || !user.password) {
            return cb(null, false, {message: "Invalid login method"});
        }

        const isValid = await bcrypt.compare(password, user.password);
        if(!isValid) {
            return cb(null, false, {message: "Invalid user credentials"});
        }

        return cb(null, user);
    }catch(err){
        console.error(err);
        return cb(err);
    }
}));

passport.serializeUser((user, cb)=>{
    //console.log(user);
    cb(null, user._id.toString())
})

passport.deserializeUser(async (id, cb)=>{
    try{
        const user = await User.findById(id);
        if(!user) return cb(null, false);
        return cb(null, user);
    }catch(err){
        console.error(err);
        return cb(err);
    }
})

module.exports = passport;

