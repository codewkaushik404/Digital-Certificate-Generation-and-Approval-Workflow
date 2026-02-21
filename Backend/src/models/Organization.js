const mongoose = require("mongoose");

const organizationSchema = new mongoose.Schema({
    name: {type: String, required: true, unique: true},
    //orgType: {type: String, required: true, enum: ["CLUB", "CELL"]},
    description: {type: String, trim: true},
    orgPositions: {
        type: [{type: mongoose.Schema.Types.ObjectId, ref: "Position", required: true}],
        required: true,
        validate: {
            validator: function(positions){
                return positions && positions.length > 0;
            }
        }
    }
}, {timestamps: true} );

const Organization = mongoose.model("Organization",organizationSchema);

module.exports = Organization;