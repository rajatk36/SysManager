const mongoose = require("mongoose");

const customerSchema = new mongoose.Schema({
  user: {
    type: String,
    required: true,
  },
  firstName: { type: String, required: true },
  lastName: { type: String },
  email: { type: String, required: true, unique: true },
  phone: { type: String },
  company: { type: String },
  address:{type: String},
  notes: { type: String }

}, { timestamps: true });

module.exports = mongoose.model("Customer", customerSchema);
