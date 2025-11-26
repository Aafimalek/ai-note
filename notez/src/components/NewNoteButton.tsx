"use client";

import { Button } from "./ui/button";
import { v4 as uuidv4 } from "uuid";
import useNote from "@/hooks/useNote";
import { Note } from "@/types";

function NewNoteButton() {
  const { addNote, setSelectedNote } = useNote();

  const handleClickNewNoteButton = async () => {
    const newNote: Note = {
      id: "", // Will be set by API
      title: "",
      content: "",
      updatedAt: new Date(),
      pinned: false,
      tags: [],
      isEncrypted: false,
      encryptedContent: undefined,
    };
    const createdNote = await addNote(newNote);
    setSelectedNote(createdNote);
  };

  return (
    <Button
      onClick={handleClickNewNoteButton}
      variant="secondary"
      className="w-24"
    >
      New Note
    </Button>
  );
}

export default NewNoteButton;
