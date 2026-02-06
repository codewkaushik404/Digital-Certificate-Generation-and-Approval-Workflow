const mongoose = require("mongoose");

const certificateBatchSchema = new mongoose.Schema({
    eventId: {type: mongoose.Schema.Types.ObjectId, ref: "Event", required: true},
    templateId: {type: mongoose.Schema.Types.ObjectId, ref: "Template", required: true},
    signatoryDetails: [{
        name: { type: String, required: true, trim: true},
        designation : { type: String, required: true, trim: true},
        signaturePath: { type: String, required: true}
    }],

    /**
     * approvers: [{type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }],
     * What Mongoose thinks this means: 
        approvers is an array
        each element inside the array:
            must be an ObjectId
            must not be null
    What it does NOT enforce : 
        that the array exists
        that the array has at least one element

    So this passes validation :
        approvers: [] (now approvers can be empty array)
    Why?
        Because there are no elements to validate — so required is never triggered.
     */
    approvers:{
        type: [{type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }],
        required: true,
        validate: {
            validator: function(v){
                return v && v.length > 0;
            },
            message: "At least one approver is required"
        }
        
    },
    createdBy: {type: mongoose.Schema.Types.ObjectId, ref: "User", required: true},
    status: {type: String, enum: ["DRAFT", "APPROVED", "ISSUED"], default: "DRAFT"},
    certificateType: {type: String, enum:["PARTICIPATION", "WINNER", "VOLUNTEER"], required: true}
}, {timestamps: true} );

const CertificateBatch = mongoose.model("CertificateBatch", certificateBatchSchema);
module.exports = CertificateBatch;