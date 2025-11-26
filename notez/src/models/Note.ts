import mongoose, { Schema, Document, Model } from 'mongoose';

export interface INote extends Document {
    userId: string; // Clerk user ID
    title: string;
    content: string;
    tags: string[];
    pinned: boolean;
    isEncrypted: boolean;
    encryptedContent?: string;
    createdAt: Date;
    updatedAt: Date;
}

const NoteSchema: Schema = new Schema(
    {
        userId: {
            type: String,
            required: true,
            index: true,
        },
        title: {
            type: String,
            required: true,
            default: 'Untitled',
        },
        content: {
            type: String,
            default: '',
        },
        tags: {
            type: [String],
            default: [],
        },
        pinned: {
            type: Boolean,
            default: false,
        },
        isEncrypted: {
            type: Boolean,
            default: false,
        },
        encryptedContent: {
            type: String,
        },
    },
    {
        timestamps: true,
    }
);

// Create index for efficient queries
NoteSchema.index({ userId: 1, updatedAt: -1 });
NoteSchema.index({ userId: 1, pinned: -1, updatedAt: -1 });

// Prevent re-compilation during development
const Note: Model<INote> =
    mongoose.models.Note || mongoose.model<INote>('Note', NoteSchema);

export default Note;

