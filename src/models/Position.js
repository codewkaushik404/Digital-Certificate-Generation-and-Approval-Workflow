const mongoose = require("mongoose");

const positionSchema = new mongoose.Schema({
    title: {
        type: String, 
        enum: ["Club-Coordinator", "Core-Team", "President", "Team-Lead", "Hod", "Faculty", "Admin"], 
        required: true,
    },    
    description: { type: String, trim: true },
    scope: { type: String, enum: ['club', 'college'], required: true }   
}, {timestamps: true} );

const Position = mongoose.model("Position",positionSchema);

module.exports = Position;