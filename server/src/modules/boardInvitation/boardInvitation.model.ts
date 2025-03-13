import mongoose, { Schema, Document, Types } from "mongoose";

export interface IBoardInvitation extends Document {
  _id: Types.ObjectId;
  boardId: string;
  invitedUserId: string;
  status: "pending" | "accepted" | "declined";
  token: string;
  createdAt: Date;
  updatedAt: Date;
}

const BoardInvitationSchema = new Schema<IBoardInvitation>(
  {
    boardId: { type: String, required: true },
    invitedUserId: { type: String, required: true },
    status: { 
      type: String, 
      required: true, 
      enum: ["pending", "accepted", "declined"], 
      default: "pending" 
    },
    token: { type: String, required: true, unique: true },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: function (_doc, ret) {
        ret.id = ret._id.toString();
        delete ret._id;
        delete ret.__v;
      }
    },
    toObject: {
      virtuals: true,
      transform: function (_doc, ret) {
        ret.id = ret._id.toString();
        delete ret._id;
        delete ret.__v;
      }
    }
  }
);

BoardInvitationSchema.pre("save", function preSave() {
  this.id = this._id.toString();
});

const BoardInvitation = mongoose.model<IBoardInvitation>("BoardInvitation", BoardInvitationSchema);
export default BoardInvitation;
