"use client";

import { FormEvent, useEffect, useRef, useState, useCallback } from "react";
import useNote from "@/hooks/useNote";
import Toolbar, { ActiveFormats } from "./Toolbar";
import { Button } from "./ui/button";
import { Lock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import EncryptNoteDialog from "./EncryptNoteDialog";
import DecryptNoteDialog from "./DecryptNoteDialog";
import AIFeaturesMenu from "./AIFeaturesMenu";

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



  const handleUpdateContent = (newContent: string) => {
    if (editorRef.current) {
      editorRef.current.innerHTML = newContent;
      if (selectedNote) {
        updateNote(selectedNote.id, { content: newContent });
      }
    }
  };

  const handleAddTags = (tags: string[]) => {
    if (selectedNote) {
      const currentTags = selectedNote.tags || [];
      const newTags = [...new Set([...currentTags, ...tags])];
      updateNote(selectedNote.id, { tags: newTags });
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
    return null;
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
    <div className="flex h-full w-full flex-col p-4">
      <div className="flex items-center mb-4 border border-sidebar-border rounded-lg p-2 bg-sidebar">
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
        <div className="ml-auto flex items-center gap-1">
          <AIFeaturesMenu
            getNoteContent={() => editorRef.current?.innerHTML || ""}
            onUpdateContent={handleUpdateContent}
            onAddTags={handleAddTags}
          />
          <Button
            onClick={handleEncryptNote}
            variant="ghost"
            size="icon"
            title="Encrypt Note"
          >
            <Lock />
          </Button>
        </div>
      </div>

      <div className="flex-1 min-h-0 overflow-auto border border-sidebar-border rounded-lg p-4 text-foreground">
        <input
          ref={titleRef}
          type="text"
          onInput={handleTitleInput}
          className="border-none bg-transparent text-4xl font-bold text-foreground focus:outline-none placeholder:text-muted-foreground"
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
