"use client";

import { Note } from "@/types";
import {
  SidebarGroupContent as SidebarGroupContentShadCN,
  SidebarMenu,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { SearchIcon } from "lucide-react";
import { Input } from "./ui/input";
import { useMemo, useState } from "react";
import Fuse from "fuse.js";
import SelectNoteButton from "./SelectNoteButton";
import DeleteNoteButton from "./DeleteNoteButton";
import PinNoteButton from "./PinNoteButton";
import { stripHtml } from "@/lib/utils";

type Props = {
  notes: Note[];
};

function SidebarGroupContent({ notes }: Props) {
  const [searchText, setSearchText] = useState("");

  const sortedNotes = useMemo(() => {
    return [...notes].sort((a, b) => {
      if (a.pinned && !b.pinned) return -1;
      if (!a.pinned && b.pinned) return 1;
      return b.updatedAt.getTime() - a.updatedAt.getTime();
    });
  }, [notes]);

  const fuse = useMemo(() => {
    return new Fuse(sortedNotes, {
      keys: ["title", "content"],
      threshold: 0.4,
      getFn: (note, path) => {
        const value = path[0] === "content" ? stripHtml(note.content) : note.title;
        return value;
      },
    });
  }, [sortedNotes]);

  const filteredNotes = searchText
    ? fuse.search(searchText).map((result) => result.item)
    : sortedNotes;

  return (
    <SidebarGroupContentShadCN>
      <div className="relative flex items-center">
        <SearchIcon className="absolute left-2 size-4" />
        <Input
          className="bg-muted pl-8"
          placeholder="Search your notes..."
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />
      </div>

      {filteredNotes.length > 0 ? (
        <SidebarMenu className="mt-4">
          {filteredNotes.map((note, index) => (
            <SidebarMenuItem key={note.id || `note-${index}`} className="group/item border-b border-sidebar-border pb-2 mb-2">
              <SelectNoteButton note={note} />
              <PinNoteButton noteId={note.id} pinned={note.pinned} />
              <DeleteNoteButton noteId={note.id} />
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      ) : (
        <div className="mt-4 text-center text-sm text-muted-foreground">
          No notes yet.
        </div>
      )}
    </SidebarGroupContentShadCN>
  );
}

export default SidebarGroupContent;
