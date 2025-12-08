"use client";

import NewNoteButton from "@/components/NewNoteButton";
import NoteTextInput from "@/components/NoteTextInput";

function HomePage() {
    return (
        <div className="flex h-full flex-col gap-4 w-full">
            <div className="flex w-full justify-end px-4 pt-4">
                <NewNoteButton />
            </div>

            <div className="flex-1 min-h-0 overflow-hidden">
                <NoteTextInput />
            </div>
        </div>
    );
}

export default HomePage;
