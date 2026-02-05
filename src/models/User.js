const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
    name: {type: String, required: true},
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    instituteName: {type: String, required: true, trim: true},
    department: {type: String, enum: ["CSE", "AIML", "ISE", "CIVIL", "ECE", "EEE", "MECHANICAL"], required: true},
    joiningYear: {type: Number, required: true, min: 1990, max: new Date().getFullYear()},    duration: {type: Number, default: 4, min:1, max:5},
    status: {type: String, enum: ["active", "inactive"], default: "active"} 
}, {timestamps: true} );

userSchema.pre("save", async function(next){
    if(!this.isModified(this.password)) return next();
    this.password = await bcrypt.hash(this.password, 12);
    next();
})

const User = mongoose.model("User", userSchema);

module.exports = User;