const express = require("express");
const app = express();
require("dotenv").config({quiet: true});
const dbConnection = require("./src/config/dbConfig");

const PORT = process.env.PORT || 5000
app.use(express.json());



(async () => {
    await dbConnection();
    app.listen(PORT, ()=>{
        console.log(`Server is running\nhttp://localhost:${PORT}`);
    });
})();