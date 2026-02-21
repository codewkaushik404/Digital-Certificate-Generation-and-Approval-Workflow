require("dotenv").config({quiet: true});
const express = require("express");
const app = express();
const PORT = process.env.PORT || 5000
const cors = require("cors");
const passport = require("./src/config/passport");
const path = require("path");
const cookieParser = require("cookie-parser");
const session = require('express-session');
const MongoStore = require("connect-mongo");

app.use(cors({
    origin: "http://localhost:5173",
    //this is used to tell browser that it is allowed to send & receive cookies 
    // from cross-origin-requests
    credentials: true
}));

app.use(session({
    name: "token",
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        sameSite: "lax",
        maxAge: 60*60*1000
    },
    secret: process.env.SECRET,
    store: MongoStore.create({
        mongoUrl: process.env.MONGODB_URI,
        ttl: 60*60*1000,
        collectionName: "sessions"
    })
}))

app.use(express.static(path.join(__dirname,"public")));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(passport.initialize());
app.use(passport.session())


const dbConnection = require("./src/config/dbConfig");
const userAuthRoutes = require("./src/routes/auth/user.auth");
const orgRoutes = require("./src/routes/organization.routes");
const userRoutes = require("./src/routes/user.routes");
const dashboardRoute = require("./src/routes/dashboard.route");

app.use("/api/v1/auth",userAuthRoutes);
app.use("/api/v1/orgs",orgRoutes);
app.use("/api/v1/users",userRoutes);
app.use("/api/v1/dashboard", dashboardRoute);
(async () => {
    try {
        await dbConnection();
        app.listen(PORT, () => {
            console.log(`Server is running\nhttp://localhost:${PORT}`);
        });
    } catch (err) {
        console.error('Failed to start server:', err);
        process.exit(1);
    }
})();