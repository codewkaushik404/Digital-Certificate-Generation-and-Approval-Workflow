require("dotenv").config({quiet: true});

const User = require("./src/models/User");
const Position = require("./src/models/Position");
const Organization = require("./src/models/Organization");
const PositionHolder = require("./src/models/PositionHolder");

/*
[
    { "Kaushik", "ADMIN", "Office of the Principal"},
    { "Sophia Martinez", "HOD", "Department of Computer Science"},
    { "Ananya Sharma", "Faculty", "Department of ECE"},
    { "Rahul Verma", "Faculty", "Department of Mechanical Engineering"},
    {}
]
*/
async function seedPositionHolder(){
    try{
        const users = await User.find({});
        const positions = await Position.find({});
        const orgs = await Organization.find({});

        // helper validators that throw descriptive errors if a lookup fails
        const findUserId = (name) => {
            const u = users.find(x => x.name === name);
            if(!u) throw new Error(`User not found: ${name}`);
            return u._id;
        }
        const findroleId = (title) => {
            const p = positions.find(x => x.title === title);
            if(!p) throw new Error(`Position not found: ${title}`);
            return p._id;
        }
        const findOrgId = (name) => {
            const o = orgs.find(x => x.name === name);
            if(!o) throw new Error(`Organization not found: ${name}`);
            return o._id;
        }

        const positionHolders = [
            { userId: findUserId("Kaushik"), roleId: findroleId("ADMIN"), orgId: findOrgId("Office of the Principal") },
            { userId: findUserId("Sophia Martinez"), roleId: findroleId("HOD"), orgId: findOrgId("Department of Computer Science") },
            { userId: findUserId("Ananya Sharma"), roleId: findroleId("FACULTY"), orgId: findOrgId("Department of ECE") },
            { userId: findUserId("Rahul Verma"), roleId: findroleId("FACULTY"), orgId: findOrgId("Department of Mechanical Engineering") },
            { userId: findUserId("Daniel Kim"), roleId: findroleId("PRESIDENT"), orgId: findOrgId("AI_CLUB") },
            { userId: findUserId("Emily Johnson"), roleId: findroleId("CLUB-COORDINATOR"), orgId: findOrgId("AI_CLUB") },
            { userId: findUserId("Rohit Mehta"), roleId: findroleId("TEAM-LEAD"), orgId: findOrgId("AI_CLUB") },
            { userId: findUserId("Sofia Lopez"), roleId: findroleId("CORE-TEAM"), orgId: findOrgId("AI_CLUB") },
        ];

        await PositionHolder.deleteMany({});
        console.log("Deleted previous records");
        await PositionHolder.insertMany(positionHolders);
        console.log("Position Holders seeded successfully");

    } catch (err) {
        console.error("Seeding position holders failed:", err.message);
        throw err;
    }
} 

module.exports = seedPositionHolder;