const bcrypt = require("bcryptjs");
const Staff = require("../model/Staff");
const Role = require("../model/Role");

const superAdmin = async () => {
  try {
    const existingAdmin = await Staff.findOne({ email: "admin@gmail.com" });
    if (existingAdmin) {
      console.log("SuperAdmin already exists");
      return;
    }

    // Create SuperAdmin role if not exists
    let role = await Role.findOne({ name: "SuperAdmin" });

    if (!role) {
      role = await Role.create({
        name: "SuperAdmin",
        permissions: [
                    "VIEW_DASHBOARD", "VIEW_STAFF", "CREATE_STAFF", "UPDATE_STAFF", "DELETE_STAFF",
                    "VIEW_ROLE", "CREATE_ROLE", "UPDATE_ROLE", "DELETE_ROLE",
                    "VIEW_PERMISSION", "CREATE_PERMISSION", "UPDATE_PERMISSION", "DELETE_PERMISSION",
                    "VIEW_TASK", "CREATE_TASK" , "UPDATE_TASK", "DELETE_TASK",
                    "VIEW_PROJECT","CREATE_PROJECT", "UPDATE_PROJECT", "DELETE_PROJECT",
                     "VIEW_DOCUMENT","CREATE_DOCUMENT","UPDATE_DOCUMENT","DELETE_DOCUMENT","APPROVE_DOCUMENT"],
        status: 1
        });
      console.log("SuperAdmin role created");
    }

    // const hashedPassword = await bcrypt.hash("123456", 10);

    await Staff.create({
      name: "Super Admin",
      phoneNo: "9999999999",
      email: "admin@gmail.com",
      password: "admin",
      role: role._id
    });

    console.log("SuperAdmin user created");

  } catch (error) {
    console.error("Error seeding SuperAdmin:", error.message);
  }
};

module.exports = superAdmin;