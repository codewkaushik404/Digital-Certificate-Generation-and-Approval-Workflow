
const mongoose = require("mongoose");

const organizationSchema = new mongoose.Schema({
    name: {type: String, required: true, unique: true},
    orgType: {type: String, required: true, enum: ["club", "cell"]},
    description: {type: String, trim: true},
    orgPositions: [{type: mongoose.Schema.Types.ObjectId, ref: "Position", required: true}]
}, {timestamps: true} );

const Organization = mongoose.model("Organization",organizationSchema);

module.exports = Organization;