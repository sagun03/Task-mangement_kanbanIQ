// tasks.model.ts
import mongoose, { Schema, Document, Types } from "mongoose";

export interface ITask extends Document {
  title: string;
  _id: Types.ObjectId;
  id?: string;
  description?: string;
  priority: "high" | "medium" | "low";
  dueDate: Date;
  assignedTo: string;
  assignedBy: string;
  status: "To Do" | "In Progress" | "Done";
  createdBy: string;
  boardOriginalId: string;
  comments: { text: string; commentedBy: string; createdAt: Date }[];
  reminders: { reminderDate: Date; sent: boolean }[];
  assignedToEmail?: string;
  assignedByEmail?: string;
  createdByEmail?: string;
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
    boardOriginalId: { type: String, required: true },
    comments: [
      {
        text: String,
        commentedBy: String,
        createdAt: { type: Date, default: Date.now },
      },
    ],
    reminders: [
      {
        reminderDate: Date,
        sent: { type: Boolean, default: false },
      },
    ],
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: function (_doc, ret) {
        ret.id = ret._id.toString();
        delete ret._id;
        delete ret.__v;
      },
    },
    toObject: {
      virtuals: true,
      transform: function (_doc, ret) {
        ret.id = ret._id.toString();
        delete ret._id;
        delete ret.__v;
      },
    },
  }
);

export default mongoose.model<ITask>("Task", TaskSchema);