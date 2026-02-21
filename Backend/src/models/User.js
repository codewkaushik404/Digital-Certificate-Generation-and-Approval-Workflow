const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
    name: {type: String, required: true},
    email: {type: String, required: true, unique: true},
    password: {type: String, required: function(){ return this.strategy === "local"}},
    googleId: {type: String, required: function(){ return this.strategy === "google"}},
    strategy: {type: [String], enum: ["local", "google"], default: ["local"]},
    instituteName: {type: String, trim: true},
    department: {type: String, enum: ["CSE", "AIML", "ISE", "CIVIL", "ECE", "EEE", "MECH"]},
    joiningYear: {type: Number, min: 1990, max: new Date().getFullYear()},    
    duration: {type: Number, default: 4, min:1, max:5},
    status: {type: String, enum: ["active", "inactive"], default: "active"}, 
    avatar: {type: String, default: "/images/userAvatar.jpg"},
    onboardingComplete: {type: Boolean, default: false}
}, {timestamps: true} );


//add a unique index to only those documents in which googleId exists 
userSchema.index(
    {    googleId: 1}, 
    {
        unique: true,
        //Normally, an index applies to all documents in a collection.
        // With partialFilterExpression, the index only applies to documents that match a filter.
        partialFilterExpression: { googleId: {$exists: true}}
    }
)

//when using async function next is not used
userSchema.pre("save", async function(){
    if (!this.strategy.includes("local")) return;
    
    if(!this.isModified("password")) return;
    //console.log("Inside prev-save hook");
    this.password = await bcrypt.hash(this.password, 12);
})

const User = mongoose.model("User", userSchema);

module.exports = User;