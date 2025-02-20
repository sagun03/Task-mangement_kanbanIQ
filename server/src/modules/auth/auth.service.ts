import { User } from "../user/user.model";

class AuthService {
  // Method to register a new user
  public static async registerUser(userDetails: any) {
    try {
      // Check if the user already exists in MongoDB
      const existingUser = await User.findOne({ email: userDetails.email });
      if (existingUser) {
        throw new Error("Email is already registered.");
      }

      // Create and save new user
      const newUser = new User({
        ...userDetails,
        dateOfJoining: new Date().toISOString(),
      });
      await newUser.save();

      return newUser;
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : "Registration failed");
    }
  }
}

export { AuthService };
