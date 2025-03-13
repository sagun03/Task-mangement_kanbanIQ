import mongoose, { Schema, Document, Types } from "mongoose";

export interface IBoard extends Document {
  _id: Types.ObjectId;
  id?: string;
  name: string;
  adminId: string;
  description: { type: String },
  invitedUserIds: string[];
  acceptedUserIds?: string[];
  columnNames: string[];
  createdAt: Date;
  updatedAt: Date;
}

const BoardSchema = new Schema<IBoard>(
  {
    name: { type: String, required: true },
    adminId: { type: String, required: true },
    description: { type: String },
    invitedUserIds: { type: [String], default: [] },
    acceptedUserIds: { type: [String], default: [] }, 
    columnNames: { type: [String], default: ["To Do", "In Progress", "Done"] },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: function (_doc, ret) {
        ret.id = ret._id.toString();
        delete ret._id;
        delete ret.v;
      }
    },
    toObject: {
      virtuals: true,
      transform: function (_doc, ret) {
        ret.id = ret._id.toString();
        delete ret._id;
        delete ret.v;
      }
    }
  }
);

BoardSchema.pre("save", function preSave() {
  this.id = this._id.toString();
});

const Board = mongoose.model<IBoard>("boards", BoardSchema);
export default Board;