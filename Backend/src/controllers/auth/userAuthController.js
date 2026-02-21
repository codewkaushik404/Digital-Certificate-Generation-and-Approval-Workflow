const User = require("../../models/User");
const passport = require("../../config/passport");
const PositionHolder = require("../../models/PositionHolder");
const Position = require("../../models/Position");
const { loginValidate, registerValidate, onboardingValidate } = require("../../utils/authValidator");

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
      console.log(req.user);

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

module.exports = {
    login,
    logout,
    register,
    onboarding
}