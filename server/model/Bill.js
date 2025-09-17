const mongoose = require("mongoose");

const billSchema = new mongoose.Schema({
  user: {
    type: String,
    ref: "User",
    required: true,
  },
  customer: {
    type: String,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
  description: {
    type: String,
  },
  status: {
    type: String,
    enum: ["unpaid", "paid", "pending"],
    default: "unpaid",
  }
}, { timestamps: true });

module.exports = mongoose.model("Bill", billSchema);
