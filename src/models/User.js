const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
    name: {type: String, required: true},
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    instituteName: {type: String, required: true, trim: true},
    department: {type: String, enum: ["CSE", "AIML", "ISE", "CIVIL", "ECE", "EEE", "MECH"], required: true},
    joiningYear: {type: Number, required: true, min: 1990, max: new Date().getFullYear()},    
    duration: {type: Number, default: 4, min:1, max:5},
    status: {type: String, enum: ["active", "inactive"], default: "active"} 
}, {timestamps: true} );

//when using async function next is not used
userSchema.pre("save", async function(){
    if(!this.isModified("password")) return;
    console.log("Inside prev-save hook");
    this.password = await bcrypt.hash(this.password, 12);
})

const User = mongoose.model("User", userSchema);

module.exports = User;