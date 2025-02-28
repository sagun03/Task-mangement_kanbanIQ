import mongoose, { Schema, Document } from "mongoose";

interface IUser extends Document {
  userId: string;
  name?: string;
  email: string;
  originalBoardIds: string[];
  originalTasksId: string[];
  dateOfJoining: Date;
}

const UserSchema = new Schema<IUser>({
  userId: { type: String, required: true, unique: true },
  name: { type: String },
  email: { type: String, required: true },
  originalBoardIds: { type: [String], default: [] },
  originalTasksId: { type: [String], default: [] },
  dateOfJoining: { type: Date, default: Date.now },
},
{
  timestamps: { createdAt: true, updatedAt: true },
  toJSON: {
    virtuals: true,
    transform: function (_doc, ret) {
      ret.id = ret._id.toString();
      delete ret._id;
      delete ret.__v; // Optional: Remove __v field
    }
  },
  toObject: {
    virtuals: true,
    transform: function (_doc, ret) {
      ret.id = ret._id.toString();
      delete ret._id;
      delete ret.__v; // Optional: Remove __v field
    }
  }
});

const User = mongoose.model<IUser>("User", UserSchema);

export { User };
