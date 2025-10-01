"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import useNote from "@/hooks/useNote";
import { useToast } from "@/hooks/use-toast";

type DecryptNoteDialogProps = {
  isOpen: boolean;
  onClose: () => void;
};

function DecryptNoteDialog({ isOpen, onClose }: DecryptNoteDialogProps) {
  const [password, setPassword] = useState("");
  const { selectedNote, decryptNoteContent } = useNote();
  const { toast } = useToast();

  const handleDecrypt = () => {
    if (selectedNote && password) {
      const success = decryptNoteContent(selectedNote.id, password);
      if (success) {
        toast({
          title: "Note Decrypted",
          description: "Your note has been successfully decrypted.",
        });
        onClose();
      } else {
        toast({
          title: "Decryption Failed",
          description: "Incorrect password. Please try again.",
          variant: "destructive",
        });
      }
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Decrypt Note</DialogTitle>
          <DialogDescription>
            Please enter the password to decrypt this note.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="password" className="text-right">
              Password
            </Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="col-span-3"
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleDecrypt}>Decrypt</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default DecryptNoteDialog;
