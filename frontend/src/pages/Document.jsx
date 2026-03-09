import React, { useEffect, useState } from "react";
import { getDocuments, deleteDocument, requestDocumentAccess } from "../api/documentApi";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { hasPermission } from "../utils/Permission";

export const Document = () => {

  const [documents, setDocuments] = useState([]);
  const { user } = useAuth();

  const fetchDocuments = async () => {
    try {
      const data = await getDocuments();
      setDocuments(data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, []);


  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this document?")) {
      try {
        await deleteDocument(id);
        fetchDocuments();
      } catch (err) {
        console.log(err);
        alert("Failed to delete document");
      }
    }
  };


  const requestAccess = async (id) => {
    const userId = user?.id || user?._id;
    if (!userId) {
      alert("User not logged in!");
      return;
    }

    try {
      await requestDocumentAccess({
        documentId: id,
        userId: userId
      });
      alert("Request sent to admin");
    } catch (err) {
      console.log(err);
    }
  };

  const currentUserId = user?.id || user?._id;
  const canDeleteDocs = hasPermission(user, 'DELETE_DOCUMENT');
  const canEditDocs = hasPermission(user, 'UPDATE_DOCUMENT');
  const canCreateDocs = hasPermission(user, 'CREATE_DOCUMENT');

  return (
    <div className="admin-container">
      <div className="admin-header">
        <h1>Documents</h1>
        {canCreateDocs && (
          <Link to="/document/create">
            <button className="btn-primary">Add Document</button>
          </Link>
        )}
      </div>

      <div className="admin-card">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Type</th>
              <th>File</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {documents.length === 0 ? (
              <tr>
                <td colSpan="4" className="no-data">No documents found</td>
              </tr>
            ) : (
              documents.map((doc) => {
                const isUploader = String(doc.uploadedBy) === String(currentUserId);
                const isSuperAdmin = user?.roleData?.name === 'SUPER_ADMIN';

                const userAccess = doc.accessUsers?.find(au => {
                  const auId = au.userId?._id || au.userId || au?._id || au;
                  return String(auId) === String(currentUserId);
                });

                const grantedPerms = userAccess?.permissions || (userAccess ? ["VIEW"] : []);

                const canView = isSuperAdmin || isUploader || grantedPerms.includes("VIEW");
                const canEdit = isSuperAdmin || isUploader || grantedPerms.includes("UPDATE") || canEditDocs;
                const canDelete = isSuperAdmin || isUploader || grantedPerms.includes("DELETE") || canDeleteDocs;
                const needsRequest = !isSuperAdmin && !isUploader && !userAccess;

                return (
                  <tr key={doc._id}>
                    <td>{doc.name}</td>
                    <td><span className="status-badge active">{doc.fileType}</span></td>
                    <td>
                      {canView ? (
                        <a
                          href={`http://localhost:3001/uploads/${doc.file}`}
                          target="_blank"
                          rel="noreferrer"
                          style={{ color: 'var(--primary-color)', fontWeight: '500' }}
                        >
                          View File
                        </a>
                      ) : (
                        <span style={{ color: 'var(--text-muted)' }}>Access Denied</span>
                      )}
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        {needsRequest && (
                          <button className="btn-secondary" onClick={() => requestAccess(doc._id)}>
                            Request Access
                          </button>
                        )}

                        {canEdit && (
                          <Link to={`/document/update/${doc._id}`}>
                            <button className="btn-secondary">Edit</button>
                          </Link>
                        )}

                        {canDelete && (
                          <button className="btn-danger" onClick={() => handleDelete(doc._id)}>
                            Delete
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};