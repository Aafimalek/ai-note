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

type EncryptNoteDialogProps = {
  isOpen: boolean;
  onClose: () => void;
};

function EncryptNoteDialog({ isOpen, onClose }: EncryptNoteDialogProps) {
  const [password, setPassword] = useState("");
  const { selectedNote, encryptNoteContent } = useNote();
  const { toast } = useToast();

  const handleEncrypt = async () => {
    if (selectedNote && password) {
      try {
        await encryptNoteContent(selectedNote.id, password);
        toast({
          title: "Note Encrypted",
          description: "Your note has been successfully encrypted.",
        });
        onClose();
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to encrypt note. Please try again.",
          variant: "destructive",
        });
      }
    } else {
      toast({
        title: "Error",
        description: "Please enter a password to encrypt the note.",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Encrypt Note</DialogTitle>
          <DialogDescription>
            Please enter a password to encrypt this note. Remember this
            password, as it will be required to view the note in the future.
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
          <Button onClick={handleEncrypt}>Encrypt</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default EncryptNoteDialog;
