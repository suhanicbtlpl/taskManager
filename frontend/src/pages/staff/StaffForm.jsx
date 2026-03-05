import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getStaff, createStaff, updateStaff } from "../../api/staffApi";
import { getRoles } from "../../api/roleApi";

export const StaffForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id;

  const [staff, setStaff] = useState({
    name: "",
    email: "",
    password: "",
    phoneNo: "",
    role: "",
  });
  const [roles, setRoles] = useState([]);

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const rolesData = await getRoles();
        setRoles(rolesData);
      } catch (error) {
        console.error("Error fetching roles:", error);
      }
    };
    fetchRoles();
  }, []);

  useEffect(() => {
    if (isEdit) {
      const fetchStaff = async () => {
        try {
          const staffList = await getStaff();
          const existing = staffList.find(
            (item) => item._id === id || item.id === Number(id)
          );
          if (existing) {
            setStaff({
              name: existing.name,
              email: existing.email,
              password: existing.password || "",
              phoneNo: existing.phoneNo || existing.phone || "",
              role: typeof existing.role === "object" ? existing.role._id : existing.role,
            });
          }
        } catch (error) {
          console.error("Error fetching staff:", error);
        }
      };
      fetchStaff();
    }
  }, [id, isEdit]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setStaff((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (isEdit) {
        await updateStaff(id, staff);
      } else {
        await createStaff(staff);
      }
      navigate("/staff");
    } catch (error) {
      console.error("Failed to save staff:", error);
      alert("Failed to save staff");
    }
  };

  return (
    <div className="admin-container">
      <div className="admin-header">
        <h1>{isEdit ? "Update Staff" : "Create Staff"}</h1>
      </div>

      <div className="admin-card">
        <form onSubmit={handleSubmit} className="admin-form">
          <div className="form-group">
            <label>Full Name</label>
            <input
              name="name"
              type="text"
              placeholder="enter your name"
              value={staff.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Email Address</label>
            <input
              name="email"
              type="email"
              placeholder="enter your gmail"
              value={staff.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              name="password"
              type="password"
              placeholder="Set a password"
              value={staff.password}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Phone Number</label>
            <input
              name="phoneNo"
              type="text"
              placeholder="e.g. +1 234 567 890"
              value={staff.phoneNo}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Assign Role</label>
            {/* <select
              name="role"
              value={staff.role}
              onChange={handleChange}
              required
            >
              <option value="">Select a Role</option>
              {roles.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.name}
                </option>
              ))}
            </select> */}
            <select
              name="role"
              value={staff.role}
              onChange={handleChange}
              required
            >
              <option value="">Select a Role</option>
              {roles.map((r) => (
                <option key={r._id || r.id} value={r._id || r.id}>
                  {r.name}
                </option>
              ))}
            </select>
          </div>

          <div className="form-actions">
            <button type="button" className="btn-secondary" onClick={() => navigate("/staff")}>
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              {isEdit ? "Update" : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};