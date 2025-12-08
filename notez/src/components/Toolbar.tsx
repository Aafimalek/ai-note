"use client";

import {
  Bold,
  Italic,
  Underline,
  AlignLeft,
  AlignCenter,
  AlignRight,
  FileText,
  BookOpen,
  Tags,
  SpellCheck,
  Languages,
  Lock,
  Loader2,
} from "lucide-react";
import { Button } from "./ui/button";

export type ActiveFormats = {
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
  justifyLeft?: boolean;
  justifyCenter?: boolean;
  justifyRight?: boolean;
};

type ToolbarProps = {
  onBold: () => void;
  onItalic: () => void;
  onUnderline: () => void;
  onAlign: (alignment: "left" | "center" | "right") => void;
  onFontSize: (size: string) => void;
  activeFormats: ActiveFormats;
  // AI Features
  onSummary?: () => void;
  onGlossary?: () => void;
  onTags?: () => void;
  onGrammar?: () => void;
  onTranslate?: () => void;
  onEncrypt?: () => void;
  isAILoading?: boolean;
};

function Toolbar({
  onBold,
  onItalic,
  onUnderline,
  onAlign,
  onFontSize,
  activeFormats,
  onSummary,
  onGlossary,
  onTags,
  onGrammar,
  onTranslate,
  onEncrypt,
  isAILoading,
}: ToolbarProps) {
  return (
    <div className="flex items-center w-full">
      {/* Text Style Buttons */}
      <div className="flex items-center">
        <Button
          variant={activeFormats.bold ? "secondary" : "ghost"}
          size="icon"
          onClick={onBold}
          title="Bold"
        >
          <Bold />
        </Button>
        <Button
          variant={activeFormats.italic ? "secondary" : "ghost"}
          size="icon"
          onClick={onItalic}
          title="Italic"
        >
          <Italic />
        </Button>
        <Button
          variant={activeFormats.underline ? "secondary" : "ghost"}
          size="icon"
          onClick={onUnderline}
          title="Underline"
        >
          <Underline />
        </Button>
      </div>

      <div className="w-px h-6 bg-sidebar-border mx-2" />

      {/* Alignment Buttons */}
      <div className="flex items-center">
        <Button
          variant={activeFormats.justifyLeft ? "secondary" : "ghost"}
          size="icon"
          onClick={() => onAlign("left")}
          title="Align Left"
        >
          <AlignLeft />
        </Button>
        <Button
          variant={activeFormats.justifyCenter ? "secondary" : "ghost"}
          size="icon"
          onClick={() => onAlign("center")}
          title="Align Center"
        >
          <AlignCenter />
        </Button>
        <Button
          variant={activeFormats.justifyRight ? "secondary" : "ghost"}
          size="icon"
          onClick={() => onAlign("right")}
          title="Align Right"
        >
          <AlignRight />
        </Button>
      </div>

      <div className="w-px h-6 bg-sidebar-border mx-2" />

      {/* Font Size */}
      <select
        onChange={(e) => onFontSize(e.target.value)}
        className="rounded-md border border-sidebar-border bg-sidebar px-2 py-1 text-sm text-foreground hover:bg-accent cursor-pointer"
        title="Font Size"
        defaultValue="3"
      >
        <option value="1" className="bg-sidebar text-foreground">Small</option>
        <option value="3" className="bg-sidebar text-foreground">Normal</option>
        <option value="5" className="bg-sidebar text-foreground">Large</option>
        <option value="7" className="bg-sidebar text-foreground">Huge</option>
      </select>

      <div className="w-px h-6 bg-sidebar-border mx-2" />

      {/* AI Features */}
      <div className="flex items-center">
        {onSummary && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onSummary}
            disabled={isAILoading}
            title="AI Summary"
          >
            {isAILoading ? <Loader2 className="animate-spin" /> : <FileText />}
          </Button>
        )}
        {onGlossary && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onGlossary}
            disabled={isAILoading}
            title="Extract Glossary"
          >
            <BookOpen />
          </Button>
        )}
        {onTags && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onTags}
            disabled={isAILoading}
            title="Suggest Tags"
          >
            <Tags />
          </Button>
        )}
        {onGrammar && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onGrammar}
            disabled={isAILoading}
            title="Check Grammar"
          >
            <SpellCheck />
          </Button>
        )}
        {onTranslate && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onTranslate}
            disabled={isAILoading}
            title="Translate"
          >
            <Languages />
          </Button>
        )}
      </div>

      <div className="w-px h-6 bg-sidebar-border mx-2" />

      {/* Encrypt */}
      {onEncrypt && (
        <Button
          variant="ghost"
          size="icon"
          onClick={onEncrypt}
          title="Encrypt Note"
        >
          <Lock />
        </Button>
      )}
    </div>
  );
}

export default Toolbar;
