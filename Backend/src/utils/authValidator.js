const zod = require("zod");

const roleEnum = zod.enum(["ADMIN", "FACULTY", "HOD", "TEAM-LEAD", "CORE-TEAM", "PRESIDENT", "CLUB-COORDINATOR" ]);
const departmentEnum = zod.enum(["CSE", "AIML", "ISE", "CIVIL", "ECE", "EEE", "MECH"], 
    {message: "Invalid department name"});

const loginValidate = zod.object({
    email: zod.string().regex(/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/),
    password: zod.string({message: "Password must be a string"}).min(8, {message: "Password must have atleast 8 characters"})
});

//name, email, password, instituteName, department, joiningYear, role
const registerValidate = zod.object({
    name: zod.string(),
    email: zod.string().regex(/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/),
    password: zod.string().min(8),
    instituteName: zod.string().min(5,{message: "Institute Name must be atleast 5 characters"}),
    department: departmentEnum,
    duration: zod.coerce.number().optional().default(4),
    joiningYear: zod.coerce.number().min(2000).max(new Date().getFullYear()),
});

module.exports = {
    registerValidate,
    loginValidate
}