import { auth } from '@clerk/nextjs/server';
import { NextRequest } from 'next/server';
import { NoteController } from '@/controllers/noteController';
import {
  successResponse,
  errorResponse,
  serverErrorResponse,
} from '@/helpers/responseHelper';

// GET - Get a single note
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ noteId: string }> }
) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return errorResponse('Unauthorized', 401);
    }

    const { noteId } = await params;
    const note = await NoteController.getNoteById(noteId, userId);

    if (!note) {
      return errorResponse('Note not found', 404);
    }

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

    return successResponse(noteData);
  } catch (error) {
    console.error('Error fetching note:', error);
    return serverErrorResponse(error);
  }
}

// PATCH - Update a note
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ noteId: string }> }
) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return errorResponse('Unauthorized', 401);
    }

    const { noteId } = await params;
    const body = await req.json();
    const { title, content, tags, pinned, isEncrypted, encryptedContent } = body;

    const note = await NoteController.updateNote(noteId, userId, {
      title,
      content,
      tags,
      pinned,
      isEncrypted,
      encryptedContent,
    });

    if (!note) {
      return errorResponse('Note not found', 404);
    }

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

    return successResponse(noteData, 'Note updated successfully');
  } catch (error) {
    console.error('Error updating note:', error);
    return serverErrorResponse(error);
  }
}

// DELETE - Delete a note
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ noteId: string }> }
) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return errorResponse('Unauthorized', 401);
    }

    const { noteId } = await params;
    const deleted = await NoteController.deleteNote(noteId, userId);

    if (!deleted) {
      return errorResponse('Note not found', 404);
    }

    return successResponse(null, 'Note deleted successfully');
  } catch (error) {
    console.error('Error deleting note:', error);
    return serverErrorResponse(error);
  }
}

