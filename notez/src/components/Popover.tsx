"use client";

import { ReactNode } from "react";

type PopoverProps = {
  children: ReactNode;
  show: boolean;
  x: number;
  y: number;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
};

function Popover({
  children,
  show,
  x,
  y,
  onMouseEnter,
  onMouseLeave,
}: PopoverProps) {
  if (!show) return null;

  return (
    <div
      className="absolute z-50 rounded-md border bg-popover p-4 text-popover-foreground shadow-md"
      style={{ left: x, top: y }}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {children}
    </div>
  );
}

export default Popover;
