const mongoose = require("mongoose");

const templateSchema = new mongoose.Schema({
    name: {type: String, required: true, unique: true, trim: true},
    backgroundFilePath: {type: String, required: true, trim: true},
    placeholder: {type: Map, of: String, required: true} 
}, {timestamps: true} );

const Template = mongoose.model("Template", templateSchema);
module.exports = Template;