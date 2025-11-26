import { auth } from '@clerk/nextjs/server';
import { NextRequest } from 'next/server';
import { NoteController } from '@/controllers/noteController';
import {
  successResponse,
  errorResponse,
  serverErrorResponse,
} from '@/helpers/responseHelper';

// PATCH - Toggle pin status
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
    const note = await NoteController.togglePin(noteId, userId);

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

    return successResponse(noteData, 'Note pin status toggled');
  } catch (error) {
    console.error('Error toggling pin:', error);
    return serverErrorResponse(error);
  }
}

