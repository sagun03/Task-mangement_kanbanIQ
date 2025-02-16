import Task from "./tasks.model";

export const getAllTasks = async () => {
  return await Task.find();
};

export const createNewTask = async (title: string, description: string, status: string) => {
  const task = new Task({ title, description, status });
  return await task.save();
};

export const updateExistingTask = async (id: string, updates: object) => {
  return await Task.findByIdAndUpdate(id, updates, { new: true });
};

export const deleteTaskById = async (id: string) => {
  return await Task.findByIdAndDelete(id);
};
