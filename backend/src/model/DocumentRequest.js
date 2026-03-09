const mongoose = require("mongoose");

const documentRequestSchema = new mongoose.Schema(
  {
    documentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Document",
      required: true
    },

    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Staff",
      required: true
    },

    status: {
      type: String,
      enum: ["Pending", "Approved", "Rejected"],
      default: "Pending"
    },

    requestedPermissions: [
      {
        type: String,
        enum: ["VIEW", "UPDATE", "DELETE"],
        default: "VIEW"
      }
    ]
  },
  { timestamps: true }
);

module.exports = mongoose.model("DocumentRequest", documentRequestSchema);  