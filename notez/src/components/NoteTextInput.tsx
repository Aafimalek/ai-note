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
import { useSubscription } from "@/hooks/useSubscription";
import Link from "next/link";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "./ui/dialog";

let titleUpdateTimeout: NodeJS.Timeout;
let contentUpdateTimeout: NodeJS.Timeout;

function NoteTextInput() {
  const { selectedNote, updateNote } = useNote();
  const titleRef = useRef<HTMLInputElement>(null);
  const editorRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const { subscription, loading: subscriptionLoading } = useSubscription();
  const [showEncryptDialog, setShowEncryptDialog] = useState(false);
  const [showDecryptDialog, setShowDecryptDialog] = useState(false);
  const [activeFormats, setActiveFormats] = useState<ActiveFormats>({});
  const [isAILoading, setIsAILoading] = useState(false);
  const [upgradeDialogOpen, setUpgradeDialogOpen] = useState(false);
  const [aiResultDialog, setAiResultDialog] = useState<{
    open: boolean;
    title: string;
    content: React.ReactNode;
  }>({ open: false, title: "", content: null });

  const checkAIAccess = (): boolean => {
    if (subscriptionLoading) {
      toast({
        title: "Loading...",
        description: "Please wait while we check your subscription.",
      });
      return false;
    }

    if (!subscription.hasAIAccess) {
      setUpgradeDialogOpen(true);
      return false;
    }

    return true;
  };


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
    if (!checkAIAccess()) return;
    const content = editorRef.current?.innerHTML;
    if (!content) return;
    setIsAILoading(true);
    try {
      const { summary } = await backendApi.summary(content);
      setAiResultDialog({
        open: true,
        title: "AI Summary",
        content: <p className="whitespace-pre-wrap">{summary}</p>,
      });
    } catch (error: any) {
      toast({ title: "AI Action Failed", description: error.message, variant: "destructive" });
    } finally {
      setIsAILoading(false);
    }
  };

  const handleGlossary = async () => {
    if (!checkAIAccess()) return;
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
    if (!checkAIAccess()) return;
    const content = editorRef.current?.innerHTML;
    if (!content) return;
    setIsAILoading(true);
    try {
      const { tags } = await backendApi.suggestTags(content);
      handleAddTags(tags);
      setAiResultDialog({
        open: true,
        title: "Tags Added",
        content: (
          <div className="flex flex-wrap gap-2">
            {tags.map((tag: string, i: number) => (
              <span key={i} className="px-2 py-1 bg-primary/20 rounded-md text-sm">{tag}</span>
            ))}
          </div>
        ),
      });
    } catch (error: any) {
      toast({ title: "AI Action Failed", description: error.message, variant: "destructive" });
    } finally {
      setIsAILoading(false);
    }
  };

  const handleGrammar = async () => {
    if (!checkAIAccess()) return;
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
    if (!checkAIAccess()) return;
    const language = prompt("Enter target language (e.g., Spanish, French):");
    if (!language) return;
    const content = editorRef.current?.innerHTML;
    if (!content) return;
    setIsAILoading(true);
    try {
      const { translation } = await backendApi.translate(content, language);
      setAiResultDialog({
        open: true,
        title: `Translated to ${language}`,
        content: <div className="prose prose-sm dark:prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: translation }} />,
      });
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
      
      {/* Upgrade Dialog */}
      <Dialog open={upgradeDialogOpen} onOpenChange={setUpgradeDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Lock className="h-5 w-5" />
              Premium Feature
            </DialogTitle>
            <DialogDescription>
              AI features are available with AI Basic or AI Pro subscription plans.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <p className="text-sm text-muted-foreground mb-4">
              Upgrade to unlock powerful AI features:
            </p>
            <ul className="list-disc list-inside space-y-2 text-sm">
              <li>AI Analysis & Summary</li>
              <li>Grammar Check</li>
              <li>Suggested Tags</li>
              <li>Translation</li>
              <li>Glossary Extraction</li>
            </ul>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setUpgradeDialogOpen(false)}>
              Cancel
            </Button>
            <Link href="/pricing">
              <Button onClick={() => setUpgradeDialogOpen(false)}>
                View Plans
              </Button>
            </Link>
          </DialogFooter>
        </DialogContent>
      </Dialog>
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
          hasAIAccess={subscription.hasAIAccess}
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
      <Dialog open={aiResultDialog.open} onOpenChange={(open) => setAiResultDialog((prev) => ({ ...prev, open }))}>
        <DialogContent className="max-w-lg max-h-[80vh] overflow-auto">
          <DialogHeader>
            <DialogTitle>{aiResultDialog.title}</DialogTitle>
            <DialogDescription asChild>
              <div className="mt-4 text-foreground">{aiResultDialog.content}</div>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default NoteTextInput;
