import { User } from "./user.model"; // Import the User model

export class UserService {
  public static async getUserByFirebaseId(firebaseUserId: string) {
    try {
      const user = await User.findOne({ userId: firebaseUserId });
      return user;
    } catch (error: any) {
      throw new Error(`Failed to fetch user: ${error.message}`);
    }
  }

  public static async getOtherUsers(excludeUserId: string) {
    try {
      const users = await User.find({ _id: { $ne: excludeUserId } });
      return users;
    } catch (error: any) {
      throw new Error(`Failed to fetch users: ${error.message}`);
    }
  }

  public async addTaskToUser(userId: string, taskId: string) {
    try {
      await User.findOneAndUpdate(
        { userId },
        { $push: { originalTasksId: taskId } },
        { new: true }
      );
    } catch (error: any) {
      throw new Error(`Error adding task to user: ${error.message}`);
    }
  }

  public async removeTaskFromUser(userId: string, taskId: string) {
    try {
      await User.findOneAndUpdate(
        { userId },
        { $pull: { originalTasksId: taskId } },
        { new: true }
      );
    } catch (error: any) {
      throw new Error(`Error removing task from user: ${error.message}`);
    }
  }

  public async addBoardToUser(userId: string, boardId: string) {
    try {
      await User.findOneAndUpdate(
        { userId },
        { $push: { originalBoardIds: boardId } },
        { new: true }
      );
    } catch (error: any) {
      throw new Error(`Error adding board to user: ${error.message}`);
    }
  }

  public async removeBoardFromUser(userId: string, boardId: string) {
    try {
      await User.findOneAndUpdate(
        { userId },
        { $pull: { originalBoardIds: boardId } },
        { new: true }
      );
    } catch (error: any) {
      throw new Error(`Error removing board from user: ${error.message}`);
    }
  }

  public async getUserById(userId: string) {
    try {
      const user = await User.findById(userId); 
      return user;
    } catch (error: any) {
      throw new Error(`Failed to fetch user by ID: ${error.message}`);
    }
  }

  public static async getAllUsers() {
    try {
      const users = await User.find(); 
      return users;
    } catch (error: any) {
      throw new Error(`Failed to fetch users: ${error.message}`);
    }
  }
  
}
