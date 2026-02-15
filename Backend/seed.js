const dbConnection = require("./src/config/dbConfig");
const seedOrgs = require("./seedOrgs");
const seedUsers = require("./seedUsers");
const seedPositionHolder = require("./seedPositionHolder");
const seedPosition = require("./seedPosition");

async function seed(){
  try {
    await dbConnection();
    await seedUsers();
    await seedPosition();
    await seedOrgs();
    await seedPositionHolder();
    console.log("Seeding completed");
    process.exit(0);
  } catch (err) {
    console.error("Seeding failed:", err);
    process.exit(1);
  }
}

seed();