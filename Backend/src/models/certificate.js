const mongoose = require("mongoose");

const certificateSchema = new mongoose.Schema({
    batchId: {type: mongoose.Schema.Types.ObjectId, ref: "CertificateBatch", required: true },
    userId: {type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    
    /**
     * Here required: function(){ return this.revoked === false } is not written 
     * cuz required checks happen before defaults values are assigned 
     * so even though default is false, revoked will be undefined 
     * undefined === false is false thats why !this.revoked
     */

    certificateType: {type: String, required: function(){return !this.revoked } },
    certificateUrl: {type: String, required: function(){return !this.revoked } },
    revoked: {type: Boolean, default: false},
    revokedReason: {type: String, required: function(){ return this.revoked === true }}
}, {timestamps: true} );

const Certificate = mongoose.model("Certificate", certificateSchema);
module.exports = Certificate;