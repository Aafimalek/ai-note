"use client";

import { FormEvent, useEffect, useRef, useState, useCallback } from "react";
import useNote from "@/hooks/useNote";
import Toolbar, { ActiveFormats } from "./Toolbar";
import { Button } from "./ui/button";
import { Lock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import EncryptNoteDialog from "./EncryptNoteDialog";
import DecryptNoteDialog from "./DecryptNoteDialog";

let titleUpdateTimeout: NodeJS.Timeout;
let contentUpdateTimeout: NodeJS.Timeout;

function NoteTextInput() {
  const { selectedNote, updateNote } = useNote();
  const titleRef = useRef<HTMLInputElement>(null);
  const editorRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const [showEncryptDialog, setShowEncryptDialog] = useState(false);
  const [showDecryptDialog, setShowDecryptDialog] = useState(false);
  const [activeFormats, setActiveFormats] = useState<ActiveFormats>({});


  useEffect(() => {
    if (selectedNote) {
      if (titleRef.current && titleRef.current.value !== selectedNote.title) {
        titleRef.current.value = selectedNote.title;
      }
      if (
        editorRef.current &&
        editorRef.current.innerHTML !== selectedNote.content
      ) {
        editorRef.current.innerHTML = selectedNote.content;
      }
    } else {
      if (titleRef.current) titleRef.current.value = "";
      if (editorRef.current) editorRef.current.innerHTML = "";
    }
  }, [selectedNote]);

  const updateActiveFormats = useCallback(() => {
    const newFormats: ActiveFormats = {};
    const commands: (keyof ActiveFormats)[] = [
      "bold",
      "italic",
      "underline",
      "justifyLeft",
      "justifyCenter",
      "justifyRight",
    ];
    commands.forEach((command) => {
      if (document.queryCommandState(command)) {
        newFormats[command] = true;
      }
    });
    setActiveFormats(newFormats);
  }, []);

  useEffect(() => {
    const editor = editorRef.current;
    const handleSelectionChange = () => {
      updateActiveFormats();
    };

    if (editor) {
      document.addEventListener("selectionchange", handleSelectionChange);
      editor.addEventListener("click", handleSelectionChange);
    }

    return () => {
      if (editor) {
        document.removeEventListener("selectionchange", handleSelectionChange);
        editor.removeEventListener("click", handleSelectionChange);
      }
    };
  }, [updateActiveFormats]);

  const handleTitleInput = (e: FormEvent<HTMLInputElement>) => {
    const newTitle = e.currentTarget.value;
    if (selectedNote) {
      clearTimeout(titleUpdateTimeout);
      titleUpdateTimeout = setTimeout(() => {
        updateNote(selectedNote.id, { title: newTitle });
      }, 500);
    }
  };

  const handleContentInput = (e: FormEvent<HTMLDivElement>) => {
    const newContent = e.currentTarget.innerHTML;

    if (selectedNote) {
      clearTimeout(contentUpdateTimeout);
      contentUpdateTimeout = setTimeout(() => {
        updateNote(selectedNote.id, { content: newContent });
      }, 500);
    }
  };

  const applyStyle = (command: string, value: string | null = null) => {
    if (editorRef.current) {
      editorRef.current.focus();
      document.execCommand(command, false, value ?? undefined);
      const newContent = editorRef.current.innerHTML;
      if (selectedNote) {
        clearTimeout(contentUpdateTimeout);
        contentUpdateTimeout = setTimeout(() => {
          updateNote(selectedNote.id, { content: newContent });
        }, 500);
      }
    }
  };


  const handleEncryptNote = () => {
    if (selectedNote) {
      if (selectedNote.isEncrypted) {
        toast({
          title: "Note Already Encrypted",
          description: "This note is already encrypted.",
        });
      } else {
        setShowEncryptDialog(true);
      }
    }
  };

  if (!selectedNote) {
    return (
      <div className="flex h-full max-w-4xl w-full items-center justify-center">
        <p>Select a note to start editing</p>
      </div>
    );
  }

  if (selectedNote.isEncrypted) {
    return (
      <div className="flex h-full max-w-4xl w-full flex-col items-center justify-center gap-4">
        <Lock className="size-16 text-muted-foreground" />
        <h2 className="text-2xl font-bold">This note is locked</h2>
        <p className="text-muted-foreground">
          Enter the password to decrypt and view this note.
        </p>
        <Button onClick={() => setShowDecryptDialog(true)}>Unlock Note</Button>
        <EncryptNoteDialog
          isOpen={showEncryptDialog}
          onClose={() => setShowEncryptDialog(false)}
        />
        <DecryptNoteDialog
          isOpen={showDecryptDialog}
          onClose={() => setShowDecryptDialog(false)}
        />
      </div>
    );
  }

  return (
    <div className="flex h-full w-full max-w-4xl flex-col">
      <div className="flex items-center">
        <Toolbar
          onBold={() => applyStyle("bold")}
          onItalic={() => applyStyle("italic")}
          onUnderline={() => applyStyle("underline")}
          onAlign={(align) =>
            applyStyle(
              `justify${align.charAt(0).toUpperCase() + align.slice(1)}`
            )
          }
          onFontSize={(size) => applyStyle("fontSize", size)}
          activeFormats={activeFormats}
        />
        <Button
          onClick={handleEncryptNote}
          variant="ghost"
          size="icon"
          title="Encrypt Note"
          className="ml-2"
        >
          <Lock />
        </Button>
      </div>

      <div className="custom-scrollbar mb-4 flex h-full w-full resize-none flex-col rounded-md border p-4 text-foreground">
        <input
          ref={titleRef}
          type="text"
          onInput={handleTitleInput}
          className="border-none bg-transparent text-4xl font-bold text-foreground focus:outline-none"
          placeholder="Untitled Note"
        />
        {selectedNote && selectedNote.tags && selectedNote.tags.length > 0 && (
          <div className="mb-4 flex flex-wrap gap-2">
            {selectedNote.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-secondary px-3 py-1 text-sm text-secondary-foreground"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
        <div
          ref={editorRef}
          onInput={handleContentInput}
          contentEditable={true}
          suppressContentEditableWarning={true}
          className="h-full w-full placeholder:text-muted-foreground focus:outline-none focus:ring-0"
        />
      </div>
      <EncryptNoteDialog
        isOpen={showEncryptDialog}
        onClose={() => setShowEncryptDialog(false)}
      />
      <DecryptNoteDialog
        isOpen={showDecryptDialog}
        onClose={() => setShowDecryptDialog(false)}
      />
    </div>
  );
}

export default NoteTextInput;
