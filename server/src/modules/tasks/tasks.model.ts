import mongoose, { Schema, Document, Types } from "mongoose";

export interface ITask extends Document {
  _id: Types.ObjectId; // Explicitly define _id type
  id?: string; // Optional, since it's generated dynamically
  title: string;
  description?: string;
  priority: "high" | "medium" | "low";
  dueDate: Date;
  assignedTo: string;
  assignedBy: string;
  status: "To Do" | "In Progress" | "Done";
  createdBy: string;
  boardOriginalId: string;
}

const TaskSchema = new Schema<ITask>(
  {
    title: { type: String, required: true },
    description: { type: String },
    priority: { type: String, enum: ["high", "medium", "low"], required: true },
    dueDate: { type: Date, required: true },
    assignedTo: { type: String, required: true },
    assignedBy: { type: String, required: true },
    status: { type: String, enum: ["To Do", "In Progress", "Done"], default: "To Do" },
    createdBy: { type: String, required: true },
    boardOriginalId: { type: String, required: true }
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: function (_doc, ret) {
        ret.id = ret._id.toString(); // Add id field
        delete ret._id; // Remove _id field
        delete ret.__v; // Optional: Remove __v field
      }
    },
    toObject: {
      virtuals: true,
      transform: function (_doc, ret) {
        ret.id = ret._id.toString(); // Add id field
        delete ret._id; // Remove _id field
        delete ret.__v; // Optional: Remove __v field
      }
    }
  }
);

TaskSchema.pre("save", function preSave() {
  this.id = this._id.toString();
});
const Task = mongoose.model<ITask>("tasks", TaskSchema);
export default Task;
