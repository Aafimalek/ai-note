"use client";

import { Pin, PinOff } from "lucide-react";
import { Button } from "./ui/button";
import useNote from "@/hooks/useNote";

type Props = {
  noteId: string;
  pinned: boolean;
};

function PinNoteButton({ noteId, pinned }: Props) {
  const { togglePin } = useNote();

  return (
    <Button
      onClick={(e) => {
        e.stopPropagation();
        togglePin(noteId);
      }}
      variant="ghost"
      size="icon"
      className="absolute right-10 top-1/2 size-7 -translate-y-1/2 p-0 opacity-0 group-hover/item:opacity-100"
      title={pinned ? "Unpin note" : "Pin note"}
    >
      {pinned ? <PinOff className="size-4" /> : <Pin className="size-4" />}
    </Button>
  );
}

export default PinNoteButton;
