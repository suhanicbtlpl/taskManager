const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },

  description: {
    type: String,
    required: true
  },

  assignedTo: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Staff",
      required: true
    }
  ],

  status: {
    type: String,
    enum: ["Pending", "InProgress", "Completed"],
    default: "Pending"
  },

  createdBy: {
    type: String,
    required: true
  }

}, { timestamps: true });

module.exports = mongoose.model("Task", taskSchema);