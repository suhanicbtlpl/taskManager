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
    try {

      await deleteDocument(id);

      alert("Document Deleted");

      fetchDocuments();

    } catch (err) {
      console.log(err);
    }
  };


  const requestAccess = async (id) => {

    // Using user object from AuthContext
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

    <div>

      <h2>Documents</h2>

      {canCreateDocs && (
        <Link to="/document/create">
          <button>Add Document</button>
        </Link>
      )}

      <br /><br />

      <table border="1" cellPadding="10">

        <thead>
          <tr>
            <th>Name</th>
            <th>Type</th>
            <th>File</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>

          {documents.map((doc) => {
            const isUploader = doc.uploadedBy === String(currentUserId);
            const isSuperAdmin = user?.roleData?.name === 'SUPER_ADMIN';

            // Find if this user has been granted specific access
            const userAccess = doc.accessUsers?.find(au => {
              const auId = au.userId?._id || au.userId || au?._id || au;
              return String(auId) === String(currentUserId);
            });

            // By default, if userAccess exists but doesn't have a permissions array, we assume it's the old format = VIEW access.
            const grantedPerms = userAccess?.permissions || (userAccess ? ["VIEW"] : []);

            const canView = isSuperAdmin || isUploader || grantedPerms.includes("VIEW");
            const canEdit = isSuperAdmin || isUploader || grantedPerms.includes("UPDATE") || canEditDocs; // fallback to global UPDATE_DOCUMENT if they have it
            const canDelete = isSuperAdmin || isUploader || grantedPerms.includes("DELETE") || canDeleteDocs;

            // They can request access only if they are not the uploader, not a super admin, and don't already have some permissions.
            // Actually, if they only have VIEW, maybe they want to request UPDATE or DELETE? 
            // For now, let's keep it simple: if they have NO permissions, show Request.
            // Or we just show request if they aren't the uploader or super admin. 
            // Let's show Request if they don't have all permissions.
            // A simple approach is just: if no userAccess found, show Request.
            const needsRequest = !isSuperAdmin && !isUploader && !userAccess;

            return (
              <tr key={doc._id}>
                <td>{doc.name}</td>
                <td>{doc.fileType}</td>
                <td>
                  {canView ? (
                    <a
                      href={`http://localhost:3001/uploads/${doc.file}`}
                      target="_blank"
                      rel="noreferrer"
                    >
                      View
                    </a>
                  ) : (
                    <span>Access Denied</span>
                  )}
                </td>
                <td>
                  {needsRequest && (
                    <button onClick={() => requestAccess(doc._id)}>
                      Request Access
                    </button>
                  )}

                  {canEdit && (
                    <Link to={`/document/create/${doc._id}`}>
                      <button>Edit</button>
                    </Link>
                  )}

                  {canDelete && (
                    <button onClick={() => handleDelete(doc._id)}>
                      Delete
                    </button>
                  )}

                </td>
              </tr>
            );
          })}

        </tbody>

      </table>

    </div>
  );
};