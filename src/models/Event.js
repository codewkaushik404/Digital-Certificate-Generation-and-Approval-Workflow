const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema({
    title: {type: String, required: true, unique: true, trim: true},
    description: {type: String, required: true, trim: true},
    orgId: {type: mongoose.Schema.Types.ObjectId, ref: "Organization", required: true},
    //() => new Date() is used instead of new Date() so that the current date is obtained when document 
    //is inserted and not the date on which the app was loaded
    startDate: {type: Date, min: Date.now, default: Date.now },
    endDate: {type: Date, min: Date.now, default: Date.now, 
        validate: {
            validator: function(value){
                return value >= this.startDate;
            }
        }
    },
    status: {type: String, enum: ["DRAFT", "UPCOMING", "ONGOING", "COMPLETED", "CANCELLED"], default: "DRAFT"},
    createdBy: {type: mongoose.Schema.Types.ObjectId, ref: "User", required: true}
}, {timestamps: true} );

const Event = mongoose.model("Event", eventSchema);

module.exports = Event;