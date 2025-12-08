import Note, { INote } from '@/models/Note';
import connectDB from '@/lib/db';

export interface CreateNoteData {
  userId: string;
  title?: string;
  content?: string;
  tags?: string[];
  pinned?: boolean;
  isEncrypted?: boolean;
  encryptedContent?: string;
}

export interface UpdateNoteData {
  title?: string;
  content?: string;
  tags?: string[];
  pinned?: boolean;
  isEncrypted?: boolean;
  encryptedContent?: string;
}

export class NoteController {
  /**
   * Create a new note
   */
  static async createNote(data: CreateNoteData): Promise<INote> {
    await connectDB();

    const note = new Note({
      userId: data.userId,
      title: data.title || 'Untitled',
      content: data.content || '',
      tags: data.tags || [],
      pinned: data.pinned || false,
      isEncrypted: data.isEncrypted || false,
      encryptedContent: data.encryptedContent,
    });

    await note.save();
    return note;
  }

  /**
   * Get all notes for a user
   */
  static async getUserNotes(userId: string): Promise<INote[]> {
    await connectDB();
    return await Note.find({ userId })
      .sort({ pinned: -1, updatedAt: -1 })
      .exec();
  }

  /**
   * Get a single note by ID
   */
  static async getNoteById(noteId: string, userId: string): Promise<INote | null> {
    await connectDB();
    return await Note.findOne({ _id: noteId, userId });
  }

  /**
   * Update a note
   */
  static async updateNote(
    noteId: string,
    userId: string,
    data: UpdateNoteData
  ): Promise<INote | null> {
    await connectDB();
    return await Note.findOneAndUpdate(
      { _id: noteId, userId },
      { ...data, updatedAt: new Date() },
      { new: true }
    );
  }

  /**
   * Delete a note
   */
  static async deleteNote(noteId: string, userId: string): Promise<boolean> {
    await connectDB();
    const result = await Note.deleteOne({ _id: noteId, userId });
    return result.deletedCount > 0;
  }

  /**
   * Toggle pin status of a note
   */
  static async togglePin(noteId: string, userId: string): Promise<INote | null> {
    await connectDB();
    const note = await Note.findOne({ _id: noteId, userId });
    if (!note) return null;

    note.pinned = !note.pinned;
    note.updatedAt = new Date();
    await note.save();
    return note;
  }

  /**
   * Add a tag to a note
   */
  static async addTag(
    noteId: string,
    userId: string,
    tag: string
  ): Promise<INote | null> {
    await connectDB();
    const note = await Note.findOne({ _id: noteId, userId });
    if (!note) return null;

    if (!note.tags.includes(tag)) {
      note.tags.push(tag);
      note.updatedAt = new Date();
      await note.save();
    }

    return note;
  }

  /**
   * Remove a tag from a note
   */
  static async removeTag(
    noteId: string,
    userId: string,
    tag: string
  ): Promise<INote | null> {
    await connectDB();
    const note = await Note.findOne({ _id: noteId, userId });
    if (!note) return null;

    note.tags = note.tags.filter((t) => t !== tag);
    note.updatedAt = new Date();
    await note.save();
    return note;
  }
}

