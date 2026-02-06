const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const PositionHolder = require("../models/PositionHolder");
const Position = require("../models/Position");

const { loginValidate, registerValidate } = require("../utils/authValidator");

async function login(req, res){
  try {
    const {email, password} = req.body;
    const result = loginValidate.safeParse({ email, password });

    if (!result.success) {
        const messages = result.error.issues.map(issue => issue.message);
        return res.status(400).json({ errors: messages });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid user credentials" });
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return res.status(401).json({ message: "Invalid user credentials" });
    }

    const positionHolders = await PositionHolder.find({userId: user._id});

    let roles = [];
    if(!positionHolders){
        roles = ["STUDENT"]
    }
    else{
        /**
         * for(const position of userPositions){
            const pobj = await Position.findById(position._id);
            if(pobj){ roles.push(pobj.title) }
        }
        */

        roles = await Promise.all(
            positionHolders.map( async (holder) => {
                const pobj = await Position.findById(holder._id);
                if(pobj) return pobj.title;
            })
        );   
    }
    console.log(roles);
    
    const payload = {
      id: user._id.toString(),
      roles: roles,
    };

    //console.log(payload);

    const token = jwt.sign(payload, process.env.JWT_SECRET_TOKEN, {
      expiresIn: "1h",
    });

    /**
     * 
     * code used to set a cookie -> use this piece of code when frontend is ready
    res.cookie("token", token, {
      maxAge: 60*60*1000,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production"
    });
     */

    res.json({ message: "Login Successful", token: token });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: err.message });
  }
};

function logout(req,res){
    /**
     * res.clearCookie("token",{
        maxAge: 0,
        httpOnly: true,
        secure: process.env.NODE_ENV === "production"
    });
     */

    res.json({message: "Logged out successfully"});
}


async function register(req, res){
  try {
    const { name, email, password, instituteName, department, joiningYear, duration } = req.body;
    const result = registerValidate.safeParse({
        name, email, password, instituteName, department, joiningYear, duration
    });


    //If u only want to print error messages then follow this syntax
    // result.error.issues where each issue has a message that contains the error
    if (!result.success) {
        const messages = result.error.issues.map(issue => issue.message);
        return res.status(400).json({ errors: messages });
    }   
    
    const user = await User.findOne({ email });
    if (user) {
      return res.status(401).json({ message: "Account already exists" });
    }

    const newUser = await User.create({
      name, email, password, instituteName, department, joiningYear, duration: result.data.duration
    });

    return res.json({ message: "Registered Successfully", user: newUser });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: err.message });
  }
};

module.exports = {
    login,
    logout,
    register
}