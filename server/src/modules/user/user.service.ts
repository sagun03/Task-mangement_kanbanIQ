import { User } from "./user.model"; // Import the User model

export class UserService {
  // Fetch user from MongoDB using firebaseUserId
  public static async getUserByFirebaseId(firebaseUserId: string) {
    try {
      const user = await User.findOne({ userId: firebaseUserId });

      return user;
    } catch (error: any) {
      throw new Error(`Failed to fetch user: ${error.message}`);
    }
  }
}
