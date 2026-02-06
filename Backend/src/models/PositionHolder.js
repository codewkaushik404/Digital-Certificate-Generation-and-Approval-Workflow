const mongoose = require("mongoose");

const positionHolderSchema = new mongoose.Schema({
    userId: {type: mongoose.Schema.Types.ObjectId, ref: "User", required: true},
    roleId: {type: mongoose.Schema.Types.ObjectId, ref: "Position", required: true},
    orgId: {type: mongoose.Schema.Types.ObjectId, ref: "Organization", required: true}
}, {timestamps: true} );

const PositionHolder = mongoose.model("PositionHolder", positionHolderSchema);

module.exports = PositionHolder;