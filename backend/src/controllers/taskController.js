const mongoose = require("mongoose");
const Task = require("../model/Task");
const Staff = require("../model/Staff");


// GET ALL TASKS
exports.getTasks = async (req, res) => {
  try {

    const tasks = await Task.find().populate("assignedTo", "name email");

    res.status(200).json(tasks);

  } catch (error) {

    res.status(500).json({
      message: "Server error",
      error: error.message
    });

  }
};


// CREATE TASK
exports.createTask = async (req, res) => {

  try {

    const { title, description, assignedTo, status } = req.body;

    if (!title || !description || !assignedTo || assignedTo.length === 0) {
      return res.status(400).json({
        message: "All fields are required"
      });
    }

    // Validate each staff ID
    for (const staffId of assignedTo) {

      if (!mongoose.Types.ObjectId.isValid(staffId)) {
        return res.status(400).json({
          message: "Invalid staff ID"
        });
      }

      const staff = await Staff.findById(staffId);

      if (!staff) {
        return res.status(404).json({
          message: "Assigned staff not found"
        });
      }

    }

    if (!["Pending", "InProgress", "Completed"].includes(status)) {
      return res.status(400).json({
        message: "Invalid status"
      });
    }

    const task = await Task.create({

      title,
      description,
      assignedTo,
      createdBy: req.body.createdBy || "System",
      status

    });

    res.status(201).json({
      message: "Task created successfully",
      task
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message: "Server error",
      error: error.message
    });

  }

};


// UPDATE TASK
exports.updateTask = async (req, res) => {

  try {

    const { id } = req.params;
    const { _id, __v, ...updateData } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        message: "Invalid task ID"
      });
    }

    // Validate staff IDs if provided
    if (updateData.assignedTo && Array.isArray(updateData.assignedTo)) {
      for (const staffId of updateData.assignedTo) {
        if (!mongoose.Types.ObjectId.isValid(staffId)) {
          return res.status(400).json({ message: "Invalid staff ID" });
        }
        const staff = await Staff.findById(staffId);
        if (!staff) {
          return res.status(404).json({ message: "Assigned staff not found" });
        }
      }
    }

    // Validate status if provided
    if (updateData.status && !["Pending", "InProgress", "Completed"].includes(updateData.status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const task = await Task.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    ).populate("assignedTo", "name email");

    if (!task) {
      return res.status(404).json({
        message: "Task not found"
      });
    }

    res.status(200).json({
      message: "Task updated successfully",
      task
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message: "Server error",
      error: error.message
    });

  }

};


// DELETE TASK
exports.deleteTask = async (req, res) => {

  try {

    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        message: "Invalid task ID"
      });
    }

    const task = await Task.findByIdAndDelete(id);

    if (!task) {
      return res.status(404).json({
        message: "Task not found"
      });
    }

    res.status(200).json({
      message: "Task deleted successfully"
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message: "Server error",
      error: error.message
    });

  }

};