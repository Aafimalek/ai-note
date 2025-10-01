"use client";

import { FormEvent, useEffect, useRef, useState, useCallback } from "react";
import useNote from "@/hooks/useNote";
import Toolbar, { ActiveFormats } from "./Toolbar";
import {
  identifyKeyTerms,
  getDefinition,
  getSummary,
  checkGrammar,
  getTags,
} from "@/lib/gemini";
import { Button } from "./ui/button";
import {
  Sparkles,
  X,
  FileText,
  ScanText,
  Tags,
  Lock,
  Languages,
} from "lucide-react";
import Popover from "./Popover";
import { stripHtml } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import EncryptNoteDialog from "./EncryptNoteDialog";
import DecryptNoteDialog from "./DecryptNoteDialog";
import TranslateNoteDialog from "./TranslateNoteDialog";

let titleUpdateTimeout: NodeJS.Timeout;
let contentUpdateTimeout: NodeJS.Timeout;

function NoteTextInput() {
  const { selectedNote, updateNote, addTag } = useNote();
  const titleRef = useRef<HTMLInputElement>(null);
  const editorRef = useRef<HTMLDivElement>(null);
  const [popover, setPopover] = useState<{
    show: boolean;
    content: React.ReactNode;
    x: number;
    y: number;
  }>({
    show: false,
    content: null,
    x: 0,
    y: 0,
  });
  const [definitionsCache, setDefinitionsCache] = useState<
    Record<string, string>
  >({});
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [hasHighlights, setHasHighlights] = useState(false);
  const { toast } = useToast();
  const [isSummarizing, setIsSummarizing] = useState(false);
  const [summary, setSummary] = useState<string | null>(null);
  const [isCheckingGrammar, setIsCheckingGrammar] = useState(false);
  const [hasGrammarHighlights, setHasGrammarHighlights] = useState(false);
  const popoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const interactionTypeRef = useRef<"hover" | "click" | null>(null);
  const [isTagging, setIsTagging] = useState(false);
  const [showEncryptDialog, setShowEncryptDialog] = useState(false);
  const [showDecryptDialog, setShowDecryptDialog] = useState(false);
  const [showTranslateDialog, setShowTranslateDialog] = useState(false);
  const [activeFormats, setActiveFormats] = useState<ActiveFormats>({});

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        editorRef.current &&
        !editorRef.current.contains(event.target as Node)
      ) {
        const popoverElement = document.querySelector(
          "[data-radix-popper-content-wrapper]"
        );
        if (popoverElement && !popoverElement.contains(event.target as Node)) {
          setPopover({ show: false, content: null, x: 0, y: 0 });
          interactionTypeRef.current = null;
        }
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

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
      setHasHighlights(
        editorRef.current?.querySelector("span[data-term]") !== null
      );
      setHasGrammarHighlights(
        editorRef.current?.querySelector("span[data-suggestion]") !== null
      );
    } else {
      if (titleRef.current) titleRef.current.value = "";
      if (editorRef.current) editorRef.current.innerHTML = "";
      setHasHighlights(false);
      setHasGrammarHighlights(false);
    }
    setSummary(null);
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

  const handleAnalyze = async () => {
    const apiKey = localStorage.getItem("gemini_api_key");
    if (!apiKey) {
      toast({
        title: "API Key Not Found",
        description: "Please save your Gemini API key in the sidebar.",
        variant: "destructive",
      });
      return;
    }
    if (!editorRef.current) return;
    setIsAnalyzing(true);
    try {
      const plainText = stripHtml(editorRef.current.innerHTML);
      const terms = await identifyKeyTerms(plainText, apiKey);
      if (editorRef.current) {
        let html = editorRef.current.innerHTML;
        terms.forEach((term) => {
          const escapedTerm = term.replace(
            /[.*+?^${}()|[\]\\]/g,
            "\\$&"
          );
          const regex = new RegExp(`\\b(${escapedTerm})\\b(?![^<]*>)`, "gi");
          html = html.replace(
            regex,
            `<span class="bg-primary/20 text-primary rounded-md cursor-pointer" data-term="${term}">$1</span>`
          );
        });
        editorRef.current.innerHTML = html;
        if (selectedNote) {
          updateNote(selectedNote.id, { content: html });
        }
        setHasHighlights(true);
      }
    } catch (error: unknown) {
      toast({
        title: "Analysis Failed",
        description: (error as Error).message,
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleGrammarCheck = async () => {
    const apiKey = localStorage.getItem("gemini_api_key");
    if (!apiKey) {
      toast({
        title: "API Key Not Found",
        description: "Please save your Gemini API key in the sidebar.",
        variant: "destructive",
      });
      return;
    }
    if (!editorRef.current) return;
    setIsCheckingGrammar(true);
    try {
      const plainText = stripHtml(editorRef.current.innerHTML);
      const errors = await checkGrammar(plainText, apiKey);
      const filteredErrors = errors.filter(
        (e) => e.error.trim().toLowerCase() !== e.suggestion.trim().toLowerCase()
      );
      if (filteredErrors.length === 0) {
        toast({
          title: "Grammar Check",
          description: "No grammar errors found.",
        });
      } else if (editorRef.current) {
        let html = editorRef.current.innerHTML;
        filteredErrors.forEach((item) => {
          const escapedError = item.error.replace(
            /[.*+?^${}()|[\]\\]/g,
            "\\$&"
          );
          const regex = new RegExp(`\\b(${escapedError})\\b(?![^<]*>)`, "gi");
          html = html.replace(
            regex,
            `<span class="border-b-2 border-red-500 border-dotted" data-suggestion="${item.suggestion}">$1</span>`
          );
        });
        editorRef.current.innerHTML = html;
        if (selectedNote) {
          updateNote(selectedNote.id, { content: html });
        }
        setHasGrammarHighlights(filteredErrors.length > 0);
      }
    } catch (error: unknown) {
      toast({
        title: "Grammar Check Failed",
        description: (error as Error).message,
        variant: "destructive",
      });
    } finally {
      setIsCheckingGrammar(false);
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

  const handleSuggestTags = async () => {
    const apiKey = localStorage.getItem("gemini_api_key");
    if (!apiKey) {
      toast({
        title: "API Key Not Found",
        description: "Please save your Gemini API key in the sidebar.",
        variant: "destructive",
      });
      return;
    }
    if (!editorRef.current) return;
    setIsTagging(true);
    try {
      const plainText = stripHtml(
        `${titleRef.current?.value}\n${editorRef.current.innerHTML}`
      );
      const tags = await getTags(plainText, apiKey);
      if (tags.length > 0) {
        const rect = editorRef.current.getBoundingClientRect();
        setPopover({
          show: true,
          content: (
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => {
                    if (selectedNote) {
                      addTag(selectedNote.id, tag);
                    }
                    setPopover({ show: false, content: null, x: 0, y: 0 });
                  }}
                  className="rounded-full bg-secondary px-3 py-1 text-sm text-secondary-foreground"
                >
                  {tag}
                </button>
              ))}
            </div>
          ),
          x: rect.left + window.scrollX,
          y: rect.top + window.scrollY - 60,
        });
      } else {
        toast({
          title: "No Tags Suggested",
          description: "Could not suggest any tags for this note.",
        });
      }
    } catch (error: unknown) {
      toast({
        title: "Tagging Failed",
        description: (error as Error).message,
        variant: "destructive",
      });
    } finally {
      setIsTagging(false);
    }
  };

  const acceptSuggestion = useCallback(
    (elementToReplace: HTMLElement, suggestion: string) => {
      elementToReplace.outerHTML = suggestion;
      setPopover({ show: false, content: null, x: 0, y: 0 });
      interactionTypeRef.current = null;
      if (editorRef.current && selectedNote) {
        const newContent = editorRef.current.innerHTML;
        clearTimeout(contentUpdateTimeout);
        contentUpdateTimeout = setTimeout(() => {
          updateNote(selectedNote.id, { content: newContent });
        }, 500);
      }
    },
    [selectedNote, updateNote]
  );

  const handleSummarize = async () => {
    const apiKey = localStorage.getItem("gemini_api_key");
    if (!apiKey) {
      toast({
        title: "API Key Not Found",
        description: "Please save your Gemini API key in the sidebar.",
        variant: "destructive",
      });
      return;
    }
    if (!editorRef.current) return;
    setIsSummarizing(true);
    try {
      const plainText = stripHtml(editorRef.current.innerHTML);
      const summaryText = await getSummary(plainText, apiKey);
      setSummary(summaryText);
    } catch (error: unknown) {
      toast({
        title: "Summarization Failed",
        description: (error as Error).message,
        variant: "destructive",
      });
    } finally {
      setIsSummarizing(false);
    }
  };

  const handleClearHighlights = () => {
    if (editorRef.current) {
      const termSpans = editorRef.current.querySelectorAll("span[data-term]");
      termSpans.forEach((span) => {
        span.outerHTML = span.innerHTML;
      });
      const suggestionSpans =
        editorRef.current.querySelectorAll("span[data-suggestion]");
      suggestionSpans.forEach((span) => {
        span.outerHTML = span.innerHTML;
      });
      if (selectedNote) {
        updateNote(selectedNote.id, { content: editorRef.current.innerHTML });
      }
      setHasHighlights(false);
      setHasGrammarHighlights(false);
    }
  };

  const handleMouseOver = useCallback(
    async (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (
        target.tagName === "SPAN" &&
        target.dataset.term &&
        e.clientX &&
        e.clientY
      ) {
        if (popoverTimeoutRef.current) {
          clearTimeout(popoverTimeoutRef.current);
        }
        interactionTypeRef.current = "hover";
        const term = target.dataset.term;
        let definition = definitionsCache[term];
        if (!definition) {
          setPopover({
            show: true,
            content: "Loading...",
            x: e.clientX,
            y: e.clientY,
          });
          try {
            const apiKey = localStorage.getItem("gemini_api_key");
            if (!apiKey) {
              setPopover({
                show: true,
                content: "API key not found.",
                x: e.clientX,
                y: e.clientY,
              });
              return;
            }
            definition = await getDefinition(term, apiKey);
            setDefinitionsCache((prev) => ({ ...prev, [term]: definition! }));
          } catch (error: unknown) {
            definition = (error as Error).message;
          }
        }
        setPopover({
          show: true,
          content: definition,
          x: e.clientX,
          y: e.clientY,
        });
      }
    },
    [definitionsCache]
  );

  const handleMouseOut = useCallback(() => {
    if (interactionTypeRef.current === "hover") {
      popoverTimeoutRef.current = setTimeout(() => {
        setPopover({ show: false, content: null, x: 0, y: 0 });
        interactionTypeRef.current = null;
      }, 300);
    }
  }, []);

  const handlePopoverEnter = () => {
    if (popoverTimeoutRef.current) {
      clearTimeout(popoverTimeoutRef.current);
    }
  };

  const handleClick = useCallback(
    (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName === "SPAN" && target.dataset.suggestion) {
        if (popoverTimeoutRef.current) {
          clearTimeout(popoverTimeoutRef.current);
        }
        interactionTypeRef.current = "click";
        const rect = target.getBoundingClientRect();
        setPopover({
          show: true,
          content: (
            <div className="flex items-center gap-2">
              <span>Suggestion:</span>
              <button
                onClick={() =>
                  acceptSuggestion(target, target.dataset.suggestion!)
                }
                className="rounded-md bg-primary px-2 py-1 text-sm text-primary-foreground"
              >
                {target.dataset.suggestion}
              </button>
            </div>
          ),
          x: rect.left + window.scrollX,
          y: rect.bottom + window.scrollY + 5,
        });
      }
    },
    [acceptSuggestion]
  );

  useEffect(() => {
    const editor = editorRef.current;
    if (editor) {
      editor.addEventListener("mouseover", handleMouseOver);
      editor.addEventListener("mouseout", handleMouseOut);
      editor.addEventListener("click", handleClick);
      return () => {
        editor.removeEventListener("mouseover", handleMouseOver);
        editor.removeEventListener("mouseout", handleMouseOut);
        editor.removeEventListener("click", handleClick);
      };
    }
  }, [selectedNote, handleMouseOver, handleMouseOut, handleClick]);

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
          onClick={handleAnalyze}
          variant="ghost"
          size="icon"
          title="Analyze Note"
          className="ml-2"
          disabled={isAnalyzing}
        >
          <Sparkles className={isAnalyzing ? "animate-pulse" : ""} />
        </Button>
        <Button
          onClick={handleSummarize}
          variant="ghost"
          size="icon"
          title="Summarize Note"
          className="ml-2"
          disabled={isSummarizing}
        >
          <FileText className={isSummarizing ? "animate-pulse" : ""} />
        </Button>
        <Button
          onClick={handleGrammarCheck}
          variant="ghost"
          size="icon"
          title="Check Grammar"
          className="ml-2"
          disabled={isCheckingGrammar}
        >
          <ScanText className={isCheckingGrammar ? "animate-pulse" : ""} />
        </Button>
        <Button
          onClick={handleSuggestTags}
          variant="ghost"
          size="icon"
          title="Suggest Tags"
          className="ml-2"
          disabled={isTagging}
        >
          <Tags className={isTagging ? "animate-pulse" : ""} />
        </Button>
        <Button
          onClick={handleEncryptNote}
          variant="ghost"
          size="icon"
          title="Encrypt Note"
          className="ml-2"
        >
          <Lock />
        </Button>
        <Button
          onClick={() => setShowTranslateDialog(true)}
          variant="ghost"
          size="icon"
          title="Translate Note"
          className="ml-2"
        >
          <Languages />
        </Button>
        {(hasHighlights || hasGrammarHighlights) && (
          <Button
            onClick={handleClearHighlights}
            variant="ghost"
            size="icon"
            title="Clear Highlights"
            className="ml-2"
          >
            <X />
          </Button>
        )}
      </div>

      {summary && (
        <div className="relative mt-4 rounded-md border bg-muted p-4 pr-10">
          <Button
            onClick={() => setSummary(null)}
            variant="ghost"
            size="icon"
            className="absolute right-2 top-2 size-6"
          >
            <X className="size-4" />
          </Button>
          <p className="text-sm">{summary}</p>
        </div>
      )}

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
      <Popover
        show={popover.show}
        x={popover.x}
        y={popover.y}
        onMouseEnter={handlePopoverEnter}
        onMouseLeave={handleMouseOut}
      >
        {popover.content}
      </Popover>
      <EncryptNoteDialog
        isOpen={showEncryptDialog}
        onClose={() => setShowEncryptDialog(false)}
      />
      <DecryptNoteDialog
        isOpen={showDecryptDialog}
        onClose={() => setShowDecryptDialog(false)}
      />
      <TranslateNoteDialog
        isOpen={showTranslateDialog}
        onClose={() => setShowTranslateDialog(false)}
      />
    </div>
  );
}

export default NoteTextInput;
