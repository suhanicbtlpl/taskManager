import { createContext, useContext, useState } from "react";

import { getStaff } from "../api/staffApi";
import { getRoles } from "../api/roleApi";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {

    // Initialize user from localStorage for persistence
    const [user, setUser] = useState(() => {
        const savedUser = localStorage.getItem("currentUser");
        return savedUser ? JSON.parse(savedUser) : null;
    });

    const login = async (email, password) => {
        // Hardcoded Initial Admin
        const hardcodedAdmin = {
            id: 'admin',
            name: "Initial Admin",
            email: "admin@example.com",
            password: "admin",
            roleData: {
                name: "SUPER_ADMIN",
                action: "ADMIN",
                permissions: [
                    "VIEW_DASHBOARD", "VIEW_STAFF", "CREATE_STAFF", "UPDATE_STAFF", "DELETE_STAFF",
                    "VIEW_ROLE", "CREATE_ROLE", "UPDATE_ROLE", "DELETE_ROLE",
                    "VIEW_PERMISSION", "CREATE_PERMISSION", "UPDATE_PERMISSION", "DELETE_PERMISSION",
                    "VIEW_TASK", "CREATE_TASK"
                ]
            }
        };

        let staffList = [];
        try {
            staffList = await getStaff();
        } catch (e) {
            console.error(e);
        }

        let foundUser = null;

        if (email === hardcodedAdmin.email && password === hardcodedAdmin.password) {
            foundUser = hardcodedAdmin;
        } else {
            const staff = staffList.find(s => s.email === email && s.password === password);
            if (staff) {
                let roles = [];
                try {
                    roles = await getRoles();
                } catch (e) { }

                // Backend role relation might be string/objectId or populated, normally _id from getAllRoles
                const roleId = typeof staff.role === "object" ? staff.role._id : staff.role;
                const role = roles.find(r => r._id === roleId);

                foundUser = {
                    ...staff,
                    roleData: role || { name: "No Role", permissions: [] }
                };
            }
        }

        if (foundUser) {
            // Flatten permissions for easier checking in ProtectedRoute
            const sessionUser = {
                ...foundUser,
                permissions: foundUser.roleData ? foundUser.roleData.permissions : []
            };
            setUser(sessionUser);
            localStorage.setItem("currentUser", JSON.stringify(sessionUser));
            return true;
        }
        return false;
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem("currentUser");
    };

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

// Custom hook (cleaner usage)
export const useAuth = () => {
    return useContext(AuthContext)
}