const mongoose = require("mongoose");
const Document = require("../model/Document");
const DocumentRequest = require("../model/DocumentRequest");


// ================= GET ALL DOCUMENTS =================
exports.getDocuments = async (req, res) => {
  try {

    const docs = await Document.find();

    res.status(200).json(docs);

  } catch (err) {

    res.status(500).json({
      message: "Server error",
      error: err.message
    });

  }
};


// ================= CREATE DOCUMENT =================
exports.createDocument = async (req, res) => {
  try {

    const { name, fileType, uploadedBy } = req.body;

    if (!req.file) {
      return res.status(400).json({
        message: "File required"
      });
    }

    const doc = await Document.create({
      name,
      file: req.file.filename,
      fileType: fileType || "txt",
      uploadedBy
    });

    res.status(201).json(doc);

  } catch (err) {

    res.status(500).json({
      message: "Server error",
      error: err.message
    });

  }
};


// ================= UPDATE DOCUMENT =================
exports.updateDocument = async (req, res) => {
  try {

    const { id } = req.params;

    const doc = await Document.findById(id);

    if (!doc) {
      return res.status(404).json({
        message: "Document not found"
      });
    }

    if (req.body.name) doc.name = req.body.name;
    if (req.body.fileType) doc.fileType = req.body.fileType;

    await doc.save();

    res.json({
      message: "Document updated successfully",
      doc
    });

  } catch (err) {

    res.status(500).json({
      message: "Server error",
      error: err.message
    });

  }
};


// ================= DELETE DOCUMENT =================
exports.deleteDocument = async (req, res) => {
  try {

    const { id } = req.params;

    const doc = await Document.findByIdAndDelete(id);

    if (!doc) {
      return res.status(404).json({
        message: "Document not found"
      });
    }

    res.json({
      message: "Document deleted successfully"
    });

  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }
};


// ================= USER REQUEST DOCUMENT ACCESS =================
// exports.requestDocumentAccess = async (req, res) => {
//   try {

//     const { documentId, userId } = req.body;

//     const request = await DocumentRequest.create({
//       documentId,
//       userId
//     });

//     res.status(201).json(request);

//   } catch (err) {

//     res.status(500).json({
//       message: "Server error",
//       error: err.message
//     });

//   }
// };

exports.requestDocumentAccess = async (req, res) => {
  try {
    const { documentId, userId, requestedPermissions } = req.body;

    if (!documentId || !userId) {
      return res.status(400).json({
        message: "documentId and userId are required"
      });
    }

    if (
      !mongoose.Types.ObjectId.isValid(documentId) ||
      !mongoose.Types.ObjectId.isValid(userId)
    ) {
      return res.status(400).json({
        message: "Invalid documentId or userId"
      });
    }

    const request = await DocumentRequest.create({
      documentId,
      userId: mongoose.Types.ObjectId.isValid(userId) ? userId : null,
      requestedPermissions: requestedPermissions || ["VIEW"],
      status: "Pending"
    });

    res.status(201).json(request);

  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Server error",
      error: err.message
    });
  }
};
// ================= ADMIN GET DOCUMENT REQUESTS =================
exports.getDocumentRequests = async (req, res) => {
  try {
    const requests = await DocumentRequest.find()
      .populate("documentId", "name uploadedBy")
      .populate("userId", "name email");

    res.json(requests);

  } catch (err) {
    res.status(500).json({
      message: "Server error",
      error: err.message
    });
  }
};


// ================= ADMIN / FILE ADMIN APPROVE REQUEST =================
exports.approveDocumentRequest = async (req, res) => {
  try {
    const { grantedPermissions } = req.body;
    const request = await DocumentRequest.findById(req.params.id);

    if (!request) {
      return res.status(404).json({
        message: "Request not found"
      });
    }

    request.status = "Approved";
    await request.save();

    await Document.findByIdAndUpdate(
      request.documentId,
      {
        $push: {
          accessUsers: {
            userId: request.userId,
            permissions: grantedPermissions || request.requestedPermissions || ["VIEW"]
          }
        }
      }
    );

    res.json({
      message: "Access granted"
    });

  } catch (err) {
    res.status(500).json({
      message: "Server error",
      error: err.message
    });
  }
};