import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getStaff, deleteStaff } from "../../api/staffApi";
import { getRoles } from "../../api/roleApi";
import { useAuth } from "../../context/AuthContext";
export const Staff = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [staffList, setStaffList] = useState([]);
  const [roles, setRoles] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const staffData = await getStaff();
        setStaffList(Array.isArray(staffData) ? staffData : []);

        const roleData = await getRoles();
        setRoles(Array.isArray(roleData) ? roleData : []);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  const getRoleName = (roleId) => {
    const role = roles.find(r => r._id === roleId || r.id === Number(roleId));
    return role ? role.name : "No Role";
  };

  // const handleDelete = async (id) => {
  //   if (window.confirm("Are you sure you want to delete this staff member?")) {
  //     try {
  //       await deleteStaff(id);
  //       setStaffList((prev) => prev.filter(s => s._id !== id && s.id !== id));
  //     } catch (error) {
  //       console.error("Failed to delete staff", error);
  //       alert("Failed to delete staff");
  //     }
  //   }
  // };

  const handleDelete = async (id) => {
        console.log(".........",roles)

  if (!user?.permissions?.includes(user.role.permissions)) {
    alert("You do not have permission to delete staff");
    return;
  }

  if (window.confirm("Are you sure you want to delete this staff member?")) {
    try {
      await deleteStaff(id);
      setStaffList((prev) => prev.filter(s => s._id !== id && s.id !== id));
    } catch (error) {
      console.error("Failed to delete staff", error);
      alert("Failed to delete staff");
    }
  }
};

  return (
    <div className="admin-container">
      <div className="admin-header">
        <h1>Staff Management</h1>
        <button className="btn-primary" onClick={() => navigate("create")}>
          Create Staff
        </button>
      </div>

      <div className="admin-card">
        {staffList.length === 0 ? (
          <p className="no-data">No staff added yet.</p>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Role</th>
                <th>Actions</th>
              </tr>
            </thead>
            {/* <tbody>
              {staffList.map((item) => (
                <tr key={item.id}>
                  <td>{item.name}</td>
                  <td>{item.email}</td>
                  <td>{item.phone || "N/A"}</td>
                  <td>{getRoleName(item.role)}</td>
                  <td>
                    <button
                      className="btn-secondary"
                      onClick={() => navigate(`update/${item.id}`)}
                    >
                      Edit
                    </button>
                    <button
                      className="btn-danger"
                      onClick={() => handleDelete(item.id)}
                      style={{ marginLeft: "8px" }}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody> */}

            <tbody>
              {staffList.map((item) => (
                <tr key={item._id || item.id}>
                  <td>{item.name}</td>
                  <td>{item.email}</td>
                  <td>{item.phone || "N/A"}</td>
                  <td>{getRoleName(item.role)}</td>
                  <td>
                    <button
                      className="btn-secondary"
                      onClick={() => navigate(`update/${item._id || item.id}`)}
                    >
                      Edit
                    </button>
                    <button
                      className="btn-danger"
                      onClick={() => handleDelete(item._id || item.id)}
                      style={{ marginLeft: "8px" }}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};