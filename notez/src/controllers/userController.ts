import User, { IUser, SubscriptionPlan, SubscriptionStatus } from '@/models/User';
import connectDB from '@/lib/db';

export interface CreateUserData {
  clerkId: string;
  email: string;
  firstName?: string;
  lastName?: string;
  imageUrl?: string;
}

export interface UpdateUserData {
  email?: string;
  firstName?: string;
  lastName?: string;
  imageUrl?: string;
}

export interface UpdateSubscriptionData {
  subscriptionPlan?: SubscriptionPlan;
  subscriptionStatus?: SubscriptionStatus;
  dodoCustomerId?: string;
  subscriptionId?: string;
  subscriptionExpiresAt?: Date;
}

export class UserController {
  /**
   * Create a new user
   */
  static async createUser(data: CreateUserData): Promise<IUser> {
    await connectDB();

    // Check if user already exists
    const existingUser = await User.findOne({ clerkId: data.clerkId });
    if (existingUser) {
      return existingUser;
    }

    const user = new User(data);
    await user.save();
    return user;
  }

  /**
   * Get user by Clerk ID
   */
  static async getUserByClerkId(clerkId: string): Promise<IUser | null> {
    await connectDB();
    return await User.findOne({ clerkId });
  }

  /**
   * Get user by email
   */
  static async getUserByEmail(email: string): Promise<IUser | null> {
    await connectDB();
    return await User.findOne({ email: email.toLowerCase() });
  }

  /**
   * Update user
   */
  static async updateUser(
    clerkId: string,
    data: UpdateUserData
  ): Promise<IUser | null> {
    await connectDB();
    return await User.findOneAndUpdate(
      { clerkId },
      { ...data, updatedAt: new Date() },
      { new: true }
    );
  }

  /**
   * Delete user
   */
  static async deleteUser(clerkId: string): Promise<boolean> {
    await connectDB();
    const result = await User.deleteOne({ clerkId });
    return result.deletedCount > 0;
  }

  /**
   * Update user subscription
   */
  static async updateSubscription(
    clerkId: string,
    data: UpdateSubscriptionData
  ): Promise<IUser | null> {
    await connectDB();
    return await User.findOneAndUpdate(
      { clerkId },
      { ...data, updatedAt: new Date() },
      { new: true }
    );
  }

  /**
   * Get user by Dodo Customer ID
   */
  static async getUserByDodoCustomerId(dodoCustomerId: string): Promise<IUser | null> {
    await connectDB();
    return await User.findOne({ dodoCustomerId });
  }

  /**
   * Get user by email (for webhook matching)
   */
  static async getUserByDodoEmail(email: string): Promise<IUser | null> {
    await connectDB();
    return await User.findOne({ email: email.toLowerCase() });
  }
}

