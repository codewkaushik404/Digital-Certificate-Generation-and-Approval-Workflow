
function verifyUser(req, res, next){
    /**
     * 1. Cookie content -> unique Session ID hashed with secret
     * FLOW: 
     * 2. browser will send cookie with each request
     * 3. server will look for the session ID in cookie with sessionID's in session store
     * 4. If found, run deserialize user
     * 5. Attach user obj to req [req.user]
     */
    if(req.isAuthenticated && req.isAuthenticated()) return next();
    return res.status(401).json({message: "Invaid user credentials"});
}

module.exports = verifyUser;