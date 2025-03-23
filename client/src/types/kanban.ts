/* eslint-disable @typescript-eslint/no-explicit-any */
export type Priority = 'low' | 'medium' | 'high';

export interface User {
  id: string;
  name: string;
  avatar: string;
}

export interface Comment {
  id: string;
  author: User;
  content: string;
  createdAt: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  priority: Priority;
  dueDate: string | null;
  assignees: User[];
  comments: Comment[];
  tags: string[];
  createdAt: string;
  column: string;
}

export interface Column {
  id: string;
  title: string;
  taskIds: string[];
}

export interface KanbanBoard {
  columns: Record<string, Column>;
  tasks: Record<string, Task>;
  columnOrder: string[];
}


export interface ITask {
  _id?: string;
  id?: string;
  title: string;
  description?: string;
  priority: "high" | "medium" | "low";
  dueDate: Date | string;
  assignedTo: string;
  assignedBy: string;
  status: "To Do" | "In Progress" | "Done";
  createdBy: string;
  createdAt: Date | string;
  updatedAt: Date | string;
  boardOriginalId: string;
  comments: { text: string; commentedBy: string; createdAt: Date | string }[];
  reminders: { reminderDate: Date | string; sent: boolean }[];
  assignedToEmail?: string;
  assignedByEmail?: string;
  createdByEmail?: string;
}
export interface IColumn {
  id: string;
  name: string;
}
export interface IBoard {
  _id?: string | any;
  id?: string;
  name: string;
  adminId: string;
  description?: string;
  invitedUserIds: string[];
  acceptedUserIds?: string[];
  columns: IColumn[];
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface IUser {
  _id?: string;
  id?: string;
  userId: string;
  name?: string;
  email: string;
  avatar?: string;
  originalBoardIds: string[];
  originalTasksId: string[];
  dateOfJoining: Date | string;
}
