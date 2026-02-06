const express = require("express");
const app = express();
require("dotenv").config({quiet: true});
const PORT = process.env.PORT || 5000

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const dbConnection = require("./src/config/dbConfig");
const userAuthRoutes = require("./src/routes/userAuth");

app.use("/api/v1/auth",userAuthRoutes);

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