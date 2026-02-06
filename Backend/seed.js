
const Position = require("./src/models/Position");
const dbConnection = require("./src/config/dbConfig")
require("dotenv").config({quiet: true});

const positionData = [
    { title: "CLUB-COORDINATOR", description: "Coordinates club activities", scope: "CLUB" },
    { title: "CORE-TEAM", description: "Part of the core team", scope: "CLUB" },
    { title: "PRESIDENT", description: "Leads the organization", scope: "CLUB" },
    { title: "TEAM-LEAD", description: "Leads a specific team", scope: "CLUB" },
    { title: "HOD", description: "Head of Department", scope: "COLLEGE" },
    { title: "FACULTY", description: "Faculty member", scope: "COLLEGE" },
    { title: "ADMIN", description: "Admin role", scope: "COLLEGE" }
]

async function seed(){
    try{
        await dbConnection();
        await Position.deleteMany({});
        console.log("Deleted previous data");
        await Position.insertMany(positionData);
        console.log("Inserted new data");
        console.log("Seeding completed successfully");
        process.exit(0);
    }catch(err){
        console.error(err);
        process.exit(1);
    }
}
seed();