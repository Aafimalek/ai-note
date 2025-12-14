import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IContact extends Document {
    name: string;
    email: string;
    subject: string;
    message: string;
    status: 'new' | 'read' | 'replied' | 'archived';
    createdAt: Date;
    updatedAt: Date;
}

const ContactSchema: Schema = new Schema(
    {
        name: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
            index: true,
        },
        subject: {
            type: String,
            required: true,
        },
        message: {
            type: String,
            required: true,
        },
        status: {
            type: String,
            enum: ['new', 'read', 'replied', 'archived'],
            default: 'new',
            index: true,
        },
    },
    {
        timestamps: true,
    }
);

// Create index for efficient queries
ContactSchema.index({ status: 1, createdAt: -1 });
ContactSchema.index({ email: 1, createdAt: -1 });

// Prevent re-compilation during development
const Contact: Model<IContact> =
    mongoose.models.Contact || mongoose.model<IContact>('Contact', ContactSchema);

export default Contact;

