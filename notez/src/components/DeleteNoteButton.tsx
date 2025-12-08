"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Trash2 } from "lucide-react";
import useNote from "@/hooks/useNote";

type Props = {
  noteId: string;
};

function DeleteNoteButton({ noteId }: Props) {
  const { deleteNote } = useNote();

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <button
          className="absolute right-2 top-1/2 size-7 -translate-y-1/2 p-0 rounded-md flex items-center justify-center border-2 border-foreground/30"
          style={{ backgroundColor: 'hsl(var(--sidebar-background))' }}
        >
          <Trash2 className="size-3" />
        </button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Are you sure you want to delete this note?
          </AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={() => deleteNote(noteId)}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90 w-24"
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export default DeleteNoteButton;

