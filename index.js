const express = require("express");
const app = express();
require("dotenv").config({quiet: true});

const PORT = process.env.PORT || 5000


app.listen(PORT, ()=>{
    console.log(`Server is running\nhttp://localhost:${PORT}`);
});
