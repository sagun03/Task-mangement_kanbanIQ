import mongoose from "mongoose";

const TaskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  status: { type: String, enum: ["todo", "in-progress", "done"], default: "todo" },
  createdAt: { type: Date, default: Date.now }
});

const Task = mongoose.model("Task", TaskSchema);
export default Task;
