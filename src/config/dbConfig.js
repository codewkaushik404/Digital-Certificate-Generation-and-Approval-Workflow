const mongoose = require("mongoose");

async function dbConnection(){
    try{
        const conn = await mongoose.connect(process.env.MONGODB_URI);
        console.log("Connected to database:",conn.connection.name);
    }catch(err){
        console.error(err);
        process.exit(1);
    }
}

module.exports = dbConnection;

