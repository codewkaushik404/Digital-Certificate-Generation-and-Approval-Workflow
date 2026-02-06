const mongoose = require("mongoose");

const positionSchema = new mongoose.Schema({
    title: {
        type: String, 
        enum: ["CLUB-COORDINATOR", "CORE-TEAM", "PRESIDENT", "TEAM-LEAD", "HOD", "FACULTY", "ADMIN"],
        required: true,
    },    
    description: { type: String, trim: true },
    scope: { type: String, enum: ['CLUB', 'CELL'], required: true }   
}, {timestamps: true} );

const Position = mongoose.model("Position",positionSchema);

module.exports = Position;