const mongoose = require("mongoose");

const documentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },

    file: {
      type: String,
      required: true
    },

    fileType: {
      type: String,
      default: "txt"
    },

    uploadedBy: {
      type: String,
      required: true
    },

    accessUsers: [
      {
        userId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Staff"
        },
        permissions: [
          {
            type: String,
            enum: ["VIEW", "UPDATE", "DELETE"]
          }
        ]
      }
    ]
  },
  { timestamps: true }
);

module.exports = mongoose.model("Document", documentSchema);