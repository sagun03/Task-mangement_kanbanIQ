import mongoose, { Schema, Document, Types } from "mongoose";

export interface IColumn {
  id: string;
  name: string;
}

export interface IBoard extends Document {
  _id: Types.ObjectId;
  id?: string;
  name: string;
  adminId: string;
  description?: string;
  invitedUserIds: string[];
  acceptedUserIds?: string[];
  columns: IColumn[];
  createdAt: Date;
  updatedAt: Date;
}

const ColumnSchema = new Schema<IColumn>({
  id: { type: String, required: true }, // Unique ID for each column
  name: { type: String, required: true },
});

const BoardSchema = new Schema<IBoard>(
  {
    name: { type: String, required: true },
    adminId: { type: String, required: true },
    description: { type: String, default: "" },
    invitedUserIds: { type: [String], default: [] },
    acceptedUserIds: { type: [String], default: [] },
    columns: {
      type: [ColumnSchema],
      default: [
        { id: new Types.ObjectId().toString(), name: "To Do" },
        { id: new Types.ObjectId().toString(), name: "In Progress" },
        { id: new Types.ObjectId().toString(), name: "Done" },
      ],
    },
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

BoardSchema.pre("save", function preSave() {
  this.id = this._id.toString();
});

const Board = mongoose.model<IBoard>("boards", BoardSchema);
export default Board;
