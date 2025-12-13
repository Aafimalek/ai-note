import mongoose, { Schema, Document, Model } from 'mongoose';

export type SubscriptionPlan = 'free' | 'ai_basic' | 'ai_pro';
export type SubscriptionStatus = 'active' | 'cancelled' | 'expired' | 'on_hold' | 'none';

export interface IUser extends Document {
    clerkId: string;
    email: string;
    firstName?: string;
    lastName?: string;
    imageUrl?: string;
    // Subscription fields
    subscriptionPlan?: SubscriptionPlan;
    subscriptionStatus?: SubscriptionStatus;
    dodoCustomerId?: string; // Dodo Payments customer ID
    subscriptionId?: string; // Dodo Payments subscription ID
    subscriptionExpiresAt?: Date;
    createdAt: Date;
    updatedAt: Date;
}

const UserSchema: Schema = new Schema(
    {
        clerkId: {
            type: String,
            required: true,
            unique: true,
            index: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },
        firstName: {
            type: String,
            trim: true,
        },
        lastName: {
            type: String,
            trim: true,
        },
        imageUrl: {
            type: String,
        },
        // Subscription fields
        subscriptionPlan: {
            type: String,
            enum: ['free', 'ai_basic', 'ai_pro'],
            default: 'free',
        },
        subscriptionStatus: {
            type: String,
            enum: ['active', 'cancelled', 'expired', 'on_hold', 'none'],
            default: 'none',
        },
        dodoCustomerId: {
            type: String,
            index: true,
        },
        subscriptionId: {
            type: String,
        },
        subscriptionExpiresAt: {
            type: Date,
        },
    },
    {
        timestamps: true,
    }
);

// Prevent re-compilation during development
const User: Model<IUser> =
    mongoose.models.User || mongoose.model<IUser>('User', UserSchema);

export default User;

