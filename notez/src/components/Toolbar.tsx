"use client";

import {
  Bold,
  Italic,
  Underline,
  AlignLeft,
  AlignCenter,
  AlignRight,
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
};

function Toolbar({
  onBold,
  onItalic,
  onUnderline,
  onAlign,
  onFontSize,
  activeFormats,
}: ToolbarProps) {
  return (
    <div className="flex items-center gap-2 rounded-t-md border bg-transparent p-2">
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
      <select
        onChange={(e) => onFontSize(e.target.value)}
        className="rounded-md border bg-background p-2 text-sm text-foreground hover:bg-accent hover:text-accent-foreground"
        title="Font Size"
        defaultValue="3"
      >
        <option value="1">Small</option>
        <option value="3">Normal</option>
        <option value="5">Large</option>
        <option value="7">Huge</option>
      </select>
    </div>
  );
}

export default Toolbar;
