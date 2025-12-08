"use client";

import useNote from "@/hooks/useNote";
import { Note } from "@/types";
import { SidebarMenuButton } from "./ui/sidebar";
import { Pin } from "lucide-react";
import { stripHtml } from "@/lib/utils";

type Props = {
  note: Note;
};

function SelectNoteButton({ note }: Props) {
  const { selectedNote, setSelectedNote } = useNote();

  const noteTitle = note.title || "Untitled Note";
  const noteContent = stripHtml(note.content) || "No content";

  return (
    <SidebarMenuButton
      onClick={() => setSelectedNote(note)}
      className={`h-auto items-start gap-0 pr-12 ${note.id === selectedNote?.id && "bg-sidebar-accent/50"
        }`}
    >
      <div className="flex h-fit flex-col gap-1">
        <div className="flex items-center gap-2">
          {note.pinned && <Pin className="size-3" />}
          <p className="w-full overflow-hidden truncate text-ellipsis whitespace-nowrap font-semibold">
            {noteTitle}
          </p>
        </div>
        <p className="w-full overflow-hidden truncate text-ellipsis whitespace-nowrap text-xs text-muted-foreground">
          {noteContent}
        </p>
        <p className="text-xs text-muted-foreground/80">
          {note.updatedAt.toLocaleDateString()}
        </p>
      </div>
    </SidebarMenuButton>
  );
}

export default SelectNoteButton;
