"use client";

import NewNoteButton from "@/components/NewNoteButton";
import NoteTextInput from "@/components/NoteTextInput";

function HomePage() {
  return (
    <div className="flex h-full flex-col items-center gap-4">
      <div className="flex w-full max-w-4xl justify-end gap-2">
        <NewNoteButton />
      </div>

      <NoteTextInput />
    </div>
  );
}

export default HomePage;
