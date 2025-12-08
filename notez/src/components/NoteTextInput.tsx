"use client";

import { FormEvent, useEffect, useRef, useState, useCallback } from "react";
import useNote from "@/hooks/useNote";
import Toolbar, { ActiveFormats } from "./Toolbar";
import { Button } from "./ui/button";
import { Lock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import EncryptNoteDialog from "./EncryptNoteDialog";
import DecryptNoteDialog from "./DecryptNoteDialog";
import { backendApi } from "@/lib/api";

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
  const [isAILoading, setIsAILoading] = useState(false);


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

  // AI Feature Handlers
  const handleSummary = async () => {
    const content = editorRef.current?.innerHTML;
    if (!content) return;
    setIsAILoading(true);
    try {
      const { summary } = await backendApi.summary(content);
      toast({ title: "AI Summary", description: summary });
    } catch (error: any) {
      toast({ title: "AI Action Failed", description: error.message, variant: "destructive" });
    } finally {
      setIsAILoading(false);
    }
  };

  const handleGlossary = async () => {
    const content = editorRef.current?.innerHTML;
    if (!content) {
      toast({ title: "Note is empty." });
      return;
    }
    setIsAILoading(true);
    try {
      const glossary = await backendApi.glossary(content);
      if (!glossary || Object.keys(glossary).length === 0) {
        toast({ title: "No glossary terms found." });
        return;
      }
      const tempDiv = document.createElement("div");
      tempDiv.innerHTML = content;
      const terms = Object.keys(glossary).sort((a, b) => b.length - a.length);
      const escapeRegExp = (str: string) => str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const pattern = terms.map(escapeRegExp).join("|");
      const regex = new RegExp(`\\b(${pattern})\\b`, "gi");

      const walk = (node: Node) => {
        if (node.nodeType === Node.TEXT_NODE) {
          const text = node.nodeValue || "";
          if (regex.test(text)) {
            regex.lastIndex = 0;
            const newHtml = text.replace(regex, (match) => {
              const originalTerm = terms.find(t => t.toLowerCase() === match.toLowerCase());
              const definition = originalTerm ? glossary[originalTerm] : "";
              return `<span class="glossary-term" title="${definition}">${match}</span>`;
            });
            const span = document.createElement("span");
            span.innerHTML = newHtml;
            node.parentNode?.replaceChild(span, node);
          }
        } else if (node.nodeType === Node.ELEMENT_NODE) {
          const element = node as Element;
          if (element.classList.contains("glossary-term")) return;
          Array.from(node.childNodes).forEach(walk);
        }
      };
      walk(tempDiv);
      handleUpdateContent(tempDiv.innerHTML);
      toast({ title: "Glossary Extracted", description: "Important terms have been highlighted." });
    } catch (error: any) {
      toast({ title: "AI Action Failed", description: error.message, variant: "destructive" });
    } finally {
      setIsAILoading(false);
    }
  };

  const handleTags = async () => {
    const content = editorRef.current?.innerHTML;
    if (!content) return;
    setIsAILoading(true);
    try {
      const { tags } = await backendApi.suggestTags(content);
      handleAddTags(tags);
      toast({ title: "Tags Added", description: `Added tags: ${tags.join(", ")}` });
    } catch (error: any) {
      toast({ title: "AI Action Failed", description: error.message, variant: "destructive" });
    } finally {
      setIsAILoading(false);
    }
  };

  const handleGrammar = async () => {
    const content = editorRef.current?.innerHTML;
    if (!content) return;
    setIsAILoading(true);
    try {
      const { corrected_text } = await backendApi.checkGrammar(content);
      if (corrected_text.trim() === content.trim()) {
        toast({ title: "Grammar Check", description: "No issues found!" });
        return;
      }
      handleUpdateContent(corrected_text);
      toast({ title: "Grammar Corrected", description: "Grammar issues have been fixed." });
    } catch (error: any) {
      toast({ title: "AI Action Failed", description: error.message, variant: "destructive" });
    } finally {
      setIsAILoading(false);
    }
  };

  const handleTranslate = async () => {
    const language = prompt("Enter target language (e.g., Spanish, French):");
    if (!language) return;
    const content = editorRef.current?.innerHTML;
    if (!content) return;
    setIsAILoading(true);
    try {
      const { translation } = await backendApi.translate(content, language);
      toast({ title: `Translated to ${language}`, description: "Check the note for translated content." });
    } catch (error: any) {
      toast({ title: "AI Action Failed", description: error.message, variant: "destructive" });
    } finally {
      setIsAILoading(false);
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
      <div className="flex h-full w-full flex-col items-center justify-center gap-4 text-center">
        <Lock className="size-16 text-muted-foreground" />
        <h2 className="text-2xl font-bold">This note is locked</h2>
        <p className="text-muted-foreground max-w-md">
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
    <div className="flex h-full w-full flex-col p-2">
      <div className="flex items-center mb-2 border border-sidebar-border rounded-lg p-2 bg-sidebar">
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
          onSummary={handleSummary}
          onGlossary={handleGlossary}
          onTags={handleTags}
          onGrammar={handleGrammar}
          onTranslate={handleTranslate}
          onEncrypt={handleEncryptNote}
          isAILoading={isAILoading}
        />
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
