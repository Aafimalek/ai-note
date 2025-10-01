"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import useNote from "@/hooks/useNote";
import { useToast } from "@/hooks/use-toast";
import { stripHtml } from "@/lib/utils";
import { translateText } from "@/lib/gemini";
import { Loader2, Copy } from "lucide-react";
import { Textarea } from "./ui/textarea";

type TranslateNoteDialogProps = {
  isOpen: boolean;
  onClose: () => void;
};

const languages = [
  "Spanish",
  "French",
  "German",
  "Japanese",
  "Mandarin Chinese",
  "Russian",
  "Arabic",
  "Hindi",
  "Gujarati",
];

function TranslateNoteDialog({ isOpen, onClose }: TranslateNoteDialogProps) {
  const [targetLanguage, setTargetLanguage] = useState("");
  const [translatedText, setTranslatedText] = useState("");
  const [isTranslating, setIsTranslating] = useState(false);
  const { selectedNote } = useNote();
  const { toast } = useToast();

  const originalText = selectedNote
    ? stripHtml(`${selectedNote.title}\n\n${selectedNote.content}`)
    : "";

  useEffect(() => {
    const handleTranslate = async () => {
      if (!selectedNote || !targetLanguage) {
        return;
      }

      const apiKey = localStorage.getItem("gemini_api_key");
      if (!apiKey) {
        toast({
          title: "API Key Not Found",
          description: "Please save your Gemini API key in the sidebar.",
          variant: "destructive",
        });
        return;
      }

      setIsTranslating(true);
      setTranslatedText("");
      try {
        const translation = await translateText(
          originalText,
          targetLanguage,
          apiKey
        );
        setTranslatedText(translation);
      } catch (error: unknown) {
        toast({
          title: "Translation Failed",
          description: (error as Error).message,
          variant: "destructive",
        });
      } finally {
        setIsTranslating(false);
      }
    };

    if (isOpen && targetLanguage) {
      handleTranslate();
    }
  }, [isOpen, targetLanguage, selectedNote, originalText, toast]);

  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(translatedText);
    toast({
      title: "Copied to Clipboard",
      description: "The translated text has been copied to your clipboard.",
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-4xl h-4/5 flex flex-col">
        <DialogHeader>
          <DialogTitle>Translate Note</DialogTitle>
          <DialogDescription>
            Select a language to translate your note into.
          </DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-2 gap-4 flex-grow">
          <div className="flex flex-col gap-2">
            <Label>Original</Label>
            <Textarea readOnly value={originalText} className="h-full resize-none" />
          </div>
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="language">Translation</Label>
              <Select
                onValueChange={setTargetLanguage}
                defaultValue={targetLanguage}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select Language" />
                </SelectTrigger>
                <SelectContent>
                  {languages.map((lang) => (
                    <SelectItem key={lang} value={lang}>
                      {lang}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="relative h-full">
              <Textarea
                readOnly
                value={translatedText}
                className="h-full resize-none"
                placeholder={
                  isTranslating ? "" : "Select a language to see the translation."
                }
              />
              {isTranslating && (
                <div className="absolute inset-0 flex items-center justify-center bg-background/50">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              )}
              {translatedText && (
                <Button
                  onClick={handleCopyToClipboard}
                  variant="ghost"
                  size="icon"
                  className="absolute right-2 top-2"
                >
                  <Copy className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default TranslateNoteDialog;
