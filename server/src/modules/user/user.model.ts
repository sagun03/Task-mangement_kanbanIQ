import mongoose, { Schema, Document } from "mongoose";

interface IUser extends Document {
  userId: string;
  username: string;
  email: string;
  originalBoardIds: string[];
  originalTasksId: string[];
  dateOfJoining: Date; 
}

const UserSchema = new Schema<IUser>({
  userId: { type: String, required: true, unique: true },
  username: { type: String, required: true },
  email: { type: String, required: true },
  originalBoardIds: { type: [String], default: [] },
  originalTasksId: { type: [String], default: [] },
  dateOfJoining: { type: Date, default: Date.now }, 
},
{
    timestamps: { createdAt: true, updatedAt: true }, // Enable automatic timestamps
  }
);

const User = mongoose.model<IUser>("User", UserSchema);

export { User };
