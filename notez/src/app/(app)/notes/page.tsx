"use client";

import NewNoteButton from "@/components/NewNoteButton";
import NoteTextInput from "@/components/NoteTextInput";

function HomePage() {
    return (
        <div className="flex h-full flex-col gap-4 p-4 md:p-6 max-w-6xl mx-auto w-full">
            <div className="flex w-full justify-end p-4">
                <NewNoteButton />
            </div>

            <div className="flex-1 min-h-0 bg-card/30 rounded-xl border shadow-sm backdrop-blur-sm overflow-hidden">
                <NoteTextInput />
            </div>
        </div>
    );
}

export default HomePage;
