import React, { useEffect, useState } from "react";
import { getDocumentRequests, approveDocumentRequest } from "../api/documentApi";
import { useAuth } from "../context/AuthContext";

export const DocumentRequests = () => {
    const [requests, setRequests] = useState([]);
    const { user } = useAuth();
    const currentUserId = user?.id || user?._id;

    const fetchRequests = async () => {
        try {
            const data = await getDocumentRequests();
            // Filter out requests for documents that aren't owned by the current user
            // Unless they are a super admin. We'll just assume File Admin logic here.

            // To be safe, if we don't have uploadedBy in the populated documentId, we might see everything
            // but let's filter if it exists.
            const filtered = data.filter(r => {
                // If it's a super admin, maybe they can see all.
                if (user?.roleData?.name === 'SUPER_ADMIN') return true;

                return String(r.documentId?.uploadedBy) === String(currentUserId);
            });
            setRequests(filtered);
        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        fetchRequests();
    }, []);

    const handleApprove = async (id, grantedPermissions) => {
        try {
            await approveDocumentRequest(id, grantedPermissions);
            alert("Access Granted!");
            fetchRequests();
        } catch (err) {
            console.log(err);
            alert("Failed to approve request.");
        }
    };

    return (
        <div>
            <h2>Document Access Requests</h2>
            <br />
            <table border="1" cellPadding="10">
                <thead>
                    <tr>
                        <th>Document Name</th>
                        <th>Requested By</th>
                        <th>Email</th>
                        <th>Status</th>
                        <th>Permissions to Grant</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {requests.length === 0 ? (
                        <tr>
                            <td colSpan="6">No requests found.</td>
                        </tr>
                    ) : (
                        requests.map((req) => (
                            <RequestRow key={req._id} req={req} onApprove={handleApprove} />
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
};

const RequestRow = ({ req, onApprove }) => {
    const [perms, setPerms] = useState(req.requestedPermissions || ["VIEW"]);

    const togglePerm = (p) => {
        setPerms(prev => prev.includes(p) ? prev.filter(x => x !== p) : [...prev, p]);
    };

    return (
        <tr>
            <td>{req.documentId?.name || "Unknown Document"}</td>
            <td>{req.userId?.name || "Unknown User"}</td>
            <td>{req.userId?.email || "N/A"}</td>
            <td>{req.status}</td>
            <td>
                {req.status === "Pending" ? (
                    <div style={{ display: 'flex', gap: '10px' }}>
                        <label><input type="checkbox" checked={perms.includes("VIEW")} onChange={() => togglePerm("VIEW")} /> View</label>
                        <label><input type="checkbox" checked={perms.includes("UPDATE")} onChange={() => togglePerm("UPDATE")} /> Update</label>
                        <label><input type="checkbox" checked={perms.includes("DELETE")} onChange={() => togglePerm("DELETE")} /> Delete</label>
                    </div>
                ) : (
                    <span>Allocated</span>
                )}
            </td>
            <td>
                {req.status === "Pending" ? (
                    <button onClick={() => onApprove(req._id, perms)} style={{ backgroundColor: '#28a745', color: '#fff', border: 'none', padding: '5px 10px', cursor: 'pointer' }}>
                        Approve
                    </button>
                ) : (
                    <span>Approved</span>
                )}
            </td>
        </tr>
    );
};
