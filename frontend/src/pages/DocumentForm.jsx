import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { createDocument, updateDocument, getDocuments } from "../api/documentApi";

export const DocumentForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id;

  const [name, setName] = useState("");
  const [file, setFile] = useState(null);
  const [fileType, setFileType] = useState("txt");
  const { user } = useAuth();

  useEffect(() => {
    if (isEdit) {
      const fetchDoc = async () => {
        try {
          const docs = await getDocuments();
          const doc = docs.find(d => d._id === id);
          if (doc) {
            setName(doc.name);
            setFileType(doc.fileType);
          }
        } catch (err) {
          console.log(err);
        }
      };
      fetchDoc();
    }
  }, [id, isEdit]);

  const submitForm = async (e) => {
    e.preventDefault();

    const userId = user?.id || user?._id;
    if (!userId) {
      alert("You must be logged in to manage documents");
      return;
    }

    try {
      if (isEdit) {
        // For updates, we might not always upload a new file
        const data = { name, fileType };
        // Note: If the backend updateDocument doesn't handle FormData, we send JSON.
        // If it DOES handle FormData (to allow changing file), we'd use FormData.
        // Assuming current backend updateDocument (lines 58-89 in controller) takes JSON.
        await updateDocument(id, data);
        alert("Document Updated");
      } else {
        const formData = new FormData();
        formData.append("name", name);
        formData.append("fileType", fileType);
        formData.append("uploadedBy", userId);
        formData.append("file", file);

        await createDocument(formData);
        alert("Document Uploaded");
      }
      navigate("/document");
    } catch (err) {
      console.log(err);
      alert("Operation failed");
    }
  };

  return (
    <div className="admin-container">
      <div className="admin-header">
        <h1>{isEdit ? "Edit Document" : "Upload Document"}</h1>
      </div>

      <div className="admin-card">
        <form onSubmit={submitForm} className="admin-form">
          <div className="form-group">
            <label>Document Name</label>
            <input
              type="text"
              placeholder="e.g. Project Specs"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>File Type</label>
            <select
              value={fileType}
              onChange={(e) => setFileType(e.target.value)}
            >
              <option value="txt">TXT</option>
              <option value="ppt">PPT</option>
              <option value="pdf">PDF</option>
              <option value="docx">DOCX</option>
            </select>
          </div>

          {!isEdit && (
            <div className="form-group">
              <label>Select File</label>
              <input
                type="file"
                onChange={(e) => setFile(e.target.files[0])}
                required={!isEdit}
              />
            </div>
          )}

          <div className="form-actions">
            <button type="button" className="btn-secondary" onClick={() => navigate("/document")}>
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              {isEdit ? "Update" : "Upload"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};