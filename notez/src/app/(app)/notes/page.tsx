"use client";

import NewNoteButton from "@/components/NewNoteButton";
import NoteTextInput from "@/components/NoteTextInput";

function HomePage() {
    return (
        <div className="flex h-full flex-col w-full">
            <div className="flex w-full justify-end px-2 py-1">
                <NewNoteButton />
            </div>
            <div className="flex-1 min-h-0 overflow-hidden flex items-center justify-center">
                <NoteTextInput />
            </div>
        </div>
    );
}

export default HomePage;
