import { auth } from '@clerk/nextjs/server';
import { NextRequest } from 'next/server';
import { NoteController } from '@/controllers/noteController';
import {
  successResponse,
  errorResponse,
  serverErrorResponse,
} from '@/helpers/responseHelper';

// GET - Get all notes for the authenticated user
export async function GET() {
  try {
    const { userId } = await auth();

    if (!userId) {
      return errorResponse('Unauthorized', 401);
    }

    const notes = await NoteController.getUserNotes(userId);
    
    // Convert MongoDB documents to plain objects
    const notesData = notes.map((note) => ({
      id: note._id.toString(),
      userId: note.userId,
      title: note.title,
      content: note.content,
      tags: note.tags,
      pinned: note.pinned,
      isEncrypted: note.isEncrypted,
      encryptedContent: note.encryptedContent,
      createdAt: note.createdAt,
      updatedAt: note.updatedAt,
    }));

    return successResponse(notesData);
  } catch (error) {
    console.error('Error fetching notes:', error);
    return serverErrorResponse(error);
  }
}

// POST - Create a new note
export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return errorResponse('Unauthorized', 401);
    }

    const body = await req.json();
    const { title, content, tags, pinned, isEncrypted, encryptedContent } = body;

    const note = await NoteController.createNote({
      userId,
      title,
      content,
      tags,
      pinned,
      isEncrypted,
      encryptedContent,
    });

    const noteData = {
      id: note._id.toString(),
      userId: note.userId,
      title: note.title,
      content: note.content,
      tags: note.tags,
      pinned: note.pinned,
      isEncrypted: note.isEncrypted,
      encryptedContent: note.encryptedContent,
      createdAt: note.createdAt,
      updatedAt: note.updatedAt,
    };

    return successResponse(noteData, 'Note created successfully');
  } catch (error) {
    console.error('Error creating note:', error);
    return serverErrorResponse(error);
  }
}

