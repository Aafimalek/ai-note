"use client";

import { Pin, PinOff } from "lucide-react";
import useNote from "@/hooks/useNote";

type Props = {
  noteId: string;
  pinned: boolean;
};

function PinNoteButton({ noteId, pinned }: Props) {
  const { togglePin } = useNote();

  return (
    <button
      onClick={(e) => {
        e.stopPropagation();
        togglePin(noteId);
      }}
      className="absolute right-10 top-1/2 size-7 -translate-y-1/2 p-0 rounded-md flex items-center justify-center border-2 border-foreground/30"
      style={{ backgroundColor: 'hsl(var(--sidebar-background))' }}
      title={pinned ? "Unpin note" : "Pin note"}
    >
      {pinned ? <PinOff className="size-4" /> : <Pin className="size-4" />}
    </button>
  );
}

export default PinNoteButton;

