import { auth } from '@clerk/nextjs/server';
import { NextRequest } from 'next/server';
import { NoteController } from '@/controllers/noteController';
import {
  successResponse,
  errorResponse,
  serverErrorResponse,
} from '@/helpers/responseHelper';

// POST - Add a tag
export async function POST(
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
    const { tag } = body;

    if (!tag || typeof tag !== 'string') {
      return errorResponse('Tag is required', 400);
    }

    const note = await NoteController.addTag(noteId, userId, tag);

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

    return successResponse(noteData, 'Tag added successfully');
  } catch (error) {
    console.error('Error adding tag:', error);
    return serverErrorResponse(error);
  }
}

// DELETE - Remove a tag
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
    const { searchParams } = new URL(req.url);
    const tag = searchParams.get('tag');

    if (!tag) {
      return errorResponse('Tag parameter is required', 400);
    }

    const note = await NoteController.removeTag(noteId, userId, tag);

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

    return successResponse(noteData, 'Tag removed successfully');
  } catch (error) {
    console.error('Error removing tag:', error);
    return serverErrorResponse(error);
  }
}

