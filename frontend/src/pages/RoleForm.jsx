import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getRoles, createRole, updateRole } from "../api/roleApi";

// Permission grid: resources x actions
const RESOURCES = ["STAFF", "ROLE", "TASK", "DASHBOARD", "PROJECT", "DOCUMENT"];
const ACTIONS = ["CREATE", "VIEW", "UPDATE", "DELETE"];

export const RoleForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEdit = !!id;

    const [roleName, setRoleName] = useState("");
    const [roleAction, setRoleAction] = useState("USER");
    const [roleStatus, setRoleStatus] = useState(1); // 1=Active, 0=Inactive
    const [selectedPermissions, setSelectedPermissions] = useState([]);

    useEffect(() => {
        if (isEdit) {
            const fetchRole = async () => {
                try {
                    const roleList = await getRoles();
                    const existing = roleList.find((r) => r._id === id);
                    if (existing) {
                        setRoleName(existing.name);
                        setRoleAction(existing.action || "USER");
                        setRoleStatus(existing.status ?? 1);
                        // Only keep plain string permissions, ignore any stale ObjectIds
                        const mappedPerms = (existing.permissions || []).filter(p => typeof p === "string");
                        setSelectedPermissions(mappedPerms);
                    }
                } catch (error) {
                    console.error("Error fetching role:", error);
                }
            };
            fetchRole();
        }
    }, [id, isEdit]);

    const handlePermissionToggle = (permId) => {
        setSelectedPermissions((prev) =>
            prev.includes(permId)
                ? prev.filter((p) => p !== permId)
                : [...prev, permId]
        );
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const roleObj = {
            name: roleName,
            action: roleAction,
            status: roleStatus,
            permissions: selectedPermissions,
        };

        try {
            if (isEdit) {
                await updateRole(id, roleObj);
            } else {
                await createRole(roleObj);
            }
            navigate("/role");
        } catch (error) {
            console.error("Failed to save role", error);
            alert("Failed to save role");
        }
    };

    return (
        <div className="admin-container">
            <div className="admin-header">
                <h1>{isEdit ? "Update Role" : "Create Role"}</h1>
            </div>

            <div className="admin-card">
                <form onSubmit={handleSubmit} className="admin-form">
                    <div className="form-group">
                        <label>Role Name</label>
                        <input
                            type="text"
                            placeholder="e.g. Sales Manager"
                            value={roleName}
                            onChange={(e) => setRoleName(e.target.value)}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Role Action (Type)</label>
                        <select
                            value={roleAction}
                            onChange={(e) => setRoleAction(e.target.value)}
                            required
                        >
                            <option value="USER">USER</option>
                            <option value="ADMIN">ADMIN</option>
                            <option value="SUPER_ADMIN">SUPER_ADMIN</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label>Status</label>
                        <select
                            value={roleStatus}
                            onChange={(e) => setRoleStatus(e.target.value)}
                            required
                        >
                            <option value={1}>Active</option>
                            <option value={0}>Inactive</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label>Assign Permissions</label>
                        <table className="admin-table permission-grid">
                            <thead>
                                <tr>
                                    <th>Resource</th>
                                    <th>Create</th>
                                    <th>View</th>
                                    <th>Update</th>
                                    <th>Delete</th>
                                </tr>
                            </thead>
                            <tbody>
                                {RESOURCES.map(resource => (
                                    <tr key={resource}>
                                        <td><strong>{resource}</strong></td>
                                        {ACTIONS.map(action => {
                                            const permString = `${action}_${resource}`;
                                            return (
                                                <td key={permString} style={{ textAlign: "center" }}>
                                                    <input
                                                        type="checkbox"
                                                        checked={selectedPermissions.includes(permString)}
                                                        onChange={() => handlePermissionToggle(permString)}
                                                        style={{ transform: "scale(1.2)" }}
                                                    />
                                                </td>
                                            );
                                        })}
                                    </tr>
                                ))}
                                <tr>
                                    <td><strong>DOCUMENT APPROVALS</strong></td>
                                    <td colSpan="4" style={{ textAlign: "center" }}>
                                        <label style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "10px" }}>
                                            <input
                                                type="checkbox"
                                                checked={selectedPermissions.includes("APPROVE_DOCUMENT")}
                                                onChange={() => handlePermissionToggle("APPROVE_DOCUMENT")}
                                                style={{ transform: "scale(1.2)" }}
                                            />
                                            Can Approve Document Requests
                                        </label>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    <div className="form-actions">
                        <button type="button" className="btn-secondary" onClick={() => navigate("/role")}>
                            Cancel
                        </button>
                        <button type="submit" className="btn-primary" disabled={!roleName}>
                            {isEdit ? "Update" : "Save"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
