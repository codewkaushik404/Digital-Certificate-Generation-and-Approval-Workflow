
const Organization = require("./src/models/Organization");
const Position = require("./src/models/Position");
require("dotenv").config({quiet: true});


async function seedOrgs() {
  try{
    
    await Organization.deleteMany({});


    // Fetch all positions
    const positions = await Position.find({});
    const posMap = {};
    positions.forEach(p => posMap[p.title] = p._id);

    const orgs = [
        {
          name: "AI_CLUB",
          description: "Artificial Intelligence Club",
          orgPositions: [posMap["PRESIDENT"], posMap["TEAM-LEAD"], posMap["CLUB-COORDINATOR"]],
        },
        {
          name: "ROBOTICS_CELL",
          description: "Robotics Cell of the College",
          orgPositions: [posMap["PRESIDENT"], posMap["CORE-TEAM"], posMap["CLUB-COORDINATOR"]],
        },
        {
          name: "CODING_CLUB",
          description: "Coding Club for Hackathons and Workshops",
          orgPositions: [posMap["PRESIDENT"], posMap["TEAM-LEAD"], posMap["CORE-TEAM"], posMap["CLUB-COORDINATOR"]],
        },
        {
          name: "Department of Computer Science",
          description: "Oversees undergraduate and postgraduate programs in computer science, including faculty management and curriculum development.",
          orgPositions: [posMap["HOD"], posMap["FACULTY"]],
        },
        {
          name: "Department of Business Administration",
          description: "Manages academic programs, research initiatives, and faculty within the business and management disciplines.",
          orgPositions: [posMap["HOD"], posMap["FACULTY"]],
        },
        {
          name: "Department of Electrical Engineering",
          description: "Responsible for teaching, research, and laboratory supervision in electrical and electronics engineering.",
          orgPositions: [posMap["HOD"], posMap["FACULTY"]],
        },
        {
          name: "Department of ECE",
          description: "Electronics & Communication Engineering department",
          orgPositions: [posMap["HOD"], posMap["FACULTY"]],
        },
        {
          name: "Department of Mechanical Engineering",
          description: "Mechanical Engineering department",
          orgPositions: [posMap["HOD"], posMap["FACULTY"]],
        },
        {
          name: "Office of the Principal",
          description: "The central administrative office responsible for overall leadership, academic governance, and institutional strategy.",
          orgPositions: [posMap["ADMIN"]]
        },
    ];
      

    await Organization.insertMany(orgs);
    console.log("Organizations seeded.");
  } catch (err) {
    console.error(err.message);
    throw err;
  }
}

module.exports = seedOrgs;

