export interface Task {
    id: string;
    _id?: string; // For MongoDB compatibility
    title: string;
    description: string;
    status: TaskStatus;
    dueDate: string;
    priority: TaskPriority;
    boardOriginalId: string;
    createdBy: string;
    assignedTo?: string;
    assignedBy?: string;
    createdAt?: string;
    updatedAt?: string;
  }
  
  export type TaskStatus = 'To Do' | 'In Progress' | 'Completed';
  
  export type TaskPriority = 'low' | 'medium' | 'high';
  
  export interface TaskFormData {
    title: string;
    description: string;
    status: TaskStatus;
    dueDate: string;
    priority: TaskPriority;
    boardOriginalId: string;
    assignedTo?: string;
  }
  
  export interface TaskUpdateData {
    title?: string;
    description?: string;
    status?: TaskStatus;
    priority?: TaskPriority;
    assignedTo?: string;
  }