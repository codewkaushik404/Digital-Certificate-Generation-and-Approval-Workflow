const User = require("../../models/User");
const passport = require("../../config/passport");
const PositionHolder = require("../../models/PositionHolder");
const Position = require("../../models/Position");
const { loginValidate, registerValidate, onboardingValidate, zodEmail } = require("../../utils/authValidator");
const sendResetToken = require("../../utils/sendResetToken");
const sendEmail = require("../../services/sendEmail");
const jwt = require("jsonwebtoken");

async function login(req, res){
  passport.authenticate("local", (err, user, info)=>{

    if(err) return res.status(500).json({message: "Internal server error"});
    
    if(!user) return res.status(401).json({message: info?.message || "Authentication failed"});
    
    req.login(user, (err)=>{
        if(err){
            console.error(err);
            return res.status(500).json({message: "Error establishing session"});
        }

        const {name, email, onboardingComplete, ...rest} = user;
        return res.json({message: "Login successful", success: true, data: {name, email, onboardingComplete} });
    })
    
  })(req, res);
};

function logout(req,res){
  // Destroy the session
  //req.logout will clear req.user and req.session.passport.user
  req.logout((err) => {
    if (err) {
      console.error("Error during logout:", err);
      return res.status(500).json({ message: "Error during logout" });
    }
    
    // Destroy the session
    // req.session.destroy will remove the session from session store and invalidate ids or fields
    req.session.destroy((err) => {
      if (err) {
        console.error("Error destroying session:", err);
        return res.status(500).json({ message: "Error destroying session" });
      }

      // Clear the session cookie
      res.clearCookie("token", {
        maxAge: 0,
        httpOnly: true,

        sameSite: "lax"
      });
      
      res.json({ message: "Logged out successfully" });
    });
  });
}

async function register(req, res){
  try {
    const { name, email, password } = req.body;
    const result = registerValidate.safeParse({
        name, email, password
    });


    //If u only want to print error messages then follow this syntax
    // result.error.issues where each issue has a message that contains the error
    if (!result.success) {
        const errors = result.error.issues.map(issue => issue.message);
        //console.log(messages);
        return res.status(400).json({ message: errors });
    }   
    
    const user = await User.findOne({ email });
    if (user) {
      //409 http code as 401 is only for authentication failures, 409 is for conflict with existing state
      return res.status(409).json({ message: "Account already exists" });
    }

    const newUser = await User.create({
      name, email, password, strategy: ["local"], onboardingComplete: false
    });

    const {onboardingComplete} = newUser;
    return res.json({message: "Registration Successful", data: {name, email, onboardingComplete}});
    
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: err.message || "Internal Server error"});
  }
};

async function onboarding(req,res){
  try{
      // req.user should be populated by verifyUser middleware and passport.session()
      if (!req.user) {
        return res.status(401).json({ message: "User not authenticated" });
      }
      //console.log(req.user);

      const {instituteName, department, joiningYear, duration} = req.body;

      const result = onboardingValidate.safeParse({
            instituteName, department, joiningYear, duration
      });

      if (!result.success) {
          const errors = result.error.issues.map(issue => issue.message);
          return res.status(400).json({ message: errors });
      }
      
      // Use the user ID from req.user (set by passport deserializeUser)
      const userId = req.user?._id
      if(!userId){
        return res.status(400).json({message: "User ID not found in session"});
      }

      // Find user by ID (more reliable than email)
      const onboardingComplete = true;
      let user = await User.findByIdAndUpdate(userId, {
        instituteName,
        department,
        joiningYear,
        duration,
        onboardingComplete
      })

      if(!user){
        return res.status(404).json({message: "User not found"});
      }
      
      // Update req.user to reflect the changes (for subsequent requests in same session)
      req.user.onboardingComplete = onboardingComplete;
  
      return res.json({ message: "Onboarding Successful", data: onboardingComplete});

    }catch (err) {
        console.error(err);
        return res.status(500).json({ message: err.message || "Internal Server Error" });
    }
}


async function forgotPassword(req, res){
  //console.log(req.body);
  const {email} = req.body;
  const validation = zodEmail.safeParse(email);
  if(!validation.success){
    let errors = validation.error.issues.map((issue) => issue.message);
    return res.status(400).json({message: errors});
  }

  const user = await User.findOne({email: email});
  if(user){
    if(!user.strategy.includes("local")){
      return res.status(400).json({message: "This email is linked with Google Login. Please use 'Sign in with Google' instead."})
    }

    const resetToken = sendResetToken(user._id);  
    const link = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;
    //console.log(resetToken);
    //console.log(link);
    await sendEmail(email, link);
  }

  return res.json({message: "If an account with that email exists, a reset link has been sent."});
}


async function resetPassword(req, res){
  const {token, newPassword} = req.body;
  try{
    if(!token || !newPassword){
      return res.status(400).json({message: "Invalid request"});
    }
    const decoded = jwt.verify(token,process.env.RESET_TOKEN_SECRET);
    const {id} = decoded;
    
    const user = await User.findOne({_id: id});
    if(!user) return res.status(401).json({message: "Invalid user credentials"});

    //findById, findByIdAndUpdate, updateOne, updateMany doesnt run pre save middleware
    
    user.password = newPassword;
    await user.save();

    return res.json({message: "Password reset successful"});

  }catch(err){
    console.log(err.message);
    return res.status(401).json({message: "Invalid or expired token sent"});
  }
}

module.exports = {
    login,
    logout,
    register,
    onboarding,
    forgotPassword,
    resetPassword
}