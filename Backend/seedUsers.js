const User = require("./src/models/User");
require("dotenv").config({quiet: true});
const bcrypt = require("bcrypt");


const users = [
    {
        name: "Kaushik",
        email: "kaushik@gmail.com",
        password: "password123",
        strategy: "local",
        instituteName: "Harvard University",
        department: "CSE",
        joiningYear: 2026,
        duration: 4,
        status: "active"
    },
    {
        name: "Ananya Sharma",
        email: "ananya.sharma@gmail.com",
        password: "password123",
        strategy: "local",
        instituteName: "Harvard University",
        department: "ECE",
        joiningYear: 2025,
        duration: 4,
        status: "active"
  },
  {
        name: "Rahul Verma",
        email: "rahul.verma@gmail.com",
        password: "password123",
        strategy: "local",
        instituteName: "Stanford University",
        department: "MECH",
        joiningYear: 2024,
        duration: 4,
        status: "active"
  },
  {
        name: "Sophia Martinez",
        email: "sophia.martinez@gmail.com",
        password: "password123",
        strategy: "local",
        instituteName: "Massachusetts Institute of Technology",
        department: "CSE",
        joiningYear: 2023,
        duration: 2,
        status: "active"
  },
  {
        name: "Daniel Kim",
        email: "daniel.kim@gmail.com",
        password: "password123",
        strategy: "local",
        instituteName: "University of California, Berkeley",
        department: "ISE",
        joiningYear: 2022,
        duration: 4,
        status: "inactive"
  },
  {
        name: "Emily Johnson",
        email: "emily.johnson@gmail.com",
        password: "password123",
        strategy: "local",
        instituteName: "Princeton University",
        department: "AIML",
        joiningYear: 2026,
        duration: 3,
        status: "active"
  },
    {
        name: "Rohit Mehta",
        email: "rohit.mehta@gmail.com",
        password: "password123",
        strategy: "local",
        instituteName: "Harvard University",
        department: "CSE",
        joiningYear: 2024,
        duration: 4,
        status: "active"
    },
    {
        name: "Sofia Lopez",
        email: "sofia.lopez@gmail.com",
        password: "password123",
        strategy: "local",
        instituteName: "Stanford University",
        department: "MECH",
        joiningYear: 2023,
        duration: 4,
        status: "active"
    },
];

async function seedUsers(){
    try{
        await User.deleteMany({});
        console.log("Deleted previous data");

        for (let user of users) {
            user.password = await bcrypt.hash(user.password, 10);
        }

        await User.insertMany(users);
        console.log("New Users inserted successfully");

    } catch (err) {
        console.error(err.message);
        throw err;
    }
}

module.exports = seedUsers;
