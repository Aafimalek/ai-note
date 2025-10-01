"use client";

import { Note } from "@/types";
import { createContext, useEffect, useState } from "react";
import { encryptNote, decryptNote } from "@/lib/encryption";

type NoteProviderContextType = {
  notes: Note[];
  setNotes: (notes: Note[]) => void;
  selectedNote: Note | null;
  setSelectedNote: (note: Note | null) => void;
  addNote: (note: Note) => void;
  updateNote: (
    noteId: string,
    data: {
      title?: string;
      content?: string;
      tags?: string[];
      isEncrypted?: boolean;
      encryptedContent?: string;
    }
  ) => void;
  deleteNote: (noteId: string) => void;
  togglePin: (noteId: string) => void;
  addTag: (noteId: string, tag: string) => void;
  encryptNoteContent: (noteId: string, password: string) => void;
  decryptNoteContent: (noteId: string, password: string) => boolean;
};

export const NoteProviderContext = createContext<NoteProviderContextType>({
  notes: [],
  setNotes: () => {},
  selectedNote: null,
  setSelectedNote: () => {},
  addNote: () => {},
  updateNote: () => {},
  deleteNote: () => {},
  togglePin: () => {},
  addTag: () => {},
  encryptNoteContent: () => {},
  decryptNoteContent: () => false,
});

function NoteProvider({ children }: { children: React.ReactNode }) {
  const [notes, setNotes] = useState<Note[]>([]);
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);

  useEffect(() => {
    try {
      const notesJSON = localStorage.getItem("notes");
      if (notesJSON) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const storedNotes = JSON.parse(notesJSON).map((note: any) => {
          const newNote = { ...note };
          if (newNote.text) {
            newNote.content = newNote.text;
            newNote.title = "Untitled";
            delete newNote.text;
          }
          newNote.updatedAt = new Date(note.updatedAt);
          if (!newNote.tags) {
            newNote.tags = [];
          }
          if (newNote.isEncrypted === undefined) {
            newNote.isEncrypted = false;
          }
          return newNote;
        });
        setNotes(storedNotes);
      }
    } catch (error) {
      console.error(error);
    }

    try {
      const noteJSON = localStorage.getItem("selectedNote");
      if (noteJSON) {
        const storedNote = JSON.parse(noteJSON);
        if (storedNote.text) {
          storedNote.content = storedNote.text;
          storedNote.title = "Untitled";
          delete storedNote.text;
        }
        if (!storedNote.tags) {
          storedNote.tags = [];
        }
        if (storedNote.isEncrypted === undefined) {
          storedNote.isEncrypted = false;
        }
        setSelectedNote({
          ...storedNote,
          updatedAt: new Date(storedNote.updatedAt),
        });
      }
    } catch (error) {
      console.error(error);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("notes", JSON.stringify(notes));
  }, [notes]);

  useEffect(() => {
    if (selectedNote) {
      localStorage.setItem("selectedNote", JSON.stringify(selectedNote));
    } else {
      localStorage.removeItem("selectedNote");
    }
  }, [selectedNote]);

  const addNote = (note: Note) => {
    setNotes((prevNotes) => [note, ...prevNotes]);
  };

  const updateNote = (
    noteId: string,
    data: {
      title?: string;
      content?: string;
      tags?: string[];
      isEncrypted?: boolean;
      encryptedContent?: string;
    }
  ) => {
    setNotes((prevNotes) =>
      prevNotes.map((note) =>
        note.id === noteId
          ? { ...note, ...data, updatedAt: new Date() }
          : note
      )
    );
  };

  const addTag = (noteId: string, tag: string) => {
    setNotes((prevNotes) =>
      prevNotes.map((note) => {
        if (note.id === noteId) {
          const currentTags = note.tags || [];
          if (!currentTags.includes(tag)) {
            return { ...note, tags: [...currentTags, tag] };
          }
        }
        return note;
      })
    );
  };

  const deleteNote = (noteId: string) => {
    setNotes((prevNotes) => prevNotes.filter((note) => note.id !== noteId));
    if (selectedNote?.id === noteId) {
      setSelectedNote(null);
    }
  };

  const togglePin = (noteId: string) => {
    setNotes((prevNotes) =>
      prevNotes.map((note) =>
        note.id === noteId ? { ...note, pinned: !note.pinned } : note
      )
    );
  };

  const encryptNoteContent = (noteId: string, password: string) => {
    setNotes((prevNotes) =>
      prevNotes.map((note) => {
        if (note.id === noteId) {
          const dataToEncrypt = JSON.stringify({
            title: note.title,
            content: note.content,
          });
          const encryptedContent = encryptNote(dataToEncrypt, password);
          const encryptedNote = {
            ...note,
            isEncrypted: true,
            encryptedContent: encryptedContent,
            content: "",
            title: "Encrypted Note",
          };
          if (selectedNote?.id === noteId) {
            setSelectedNote(encryptedNote);
          }
          return encryptedNote;
        }
        return note;
      })
    );
  };

  const decryptNoteContent = (noteId: string, password: string): boolean => {
    let success = false;
    setNotes((prevNotes) =>
      prevNotes.map((note) => {
        if (note.id === noteId && note.isEncrypted && note.encryptedContent) {
          const decryptedDataString = decryptNote(
            note.encryptedContent,
            password
          );
          if (decryptedDataString) {
            try {
              const decryptedData = JSON.parse(decryptedDataString);
              const decryptedNote = {
                ...note,
                isEncrypted: false,
                encryptedContent: undefined,
                title: decryptedData.title,
                content: decryptedData.content,
              };
              if (selectedNote?.id === noteId) {
                setSelectedNote(decryptedNote);
              }
              success = true;
              return decryptedNote;
            } catch (e) {
              console.error("Failed to parse decrypted content", e);
              success = false;
            }
          } else {
            success = false;
          }
        }
        return note;
      })
    );
    return success;
  };

  return (
    <NoteProviderContext.Provider
      value={{
        notes,
        setNotes,
        selectedNote,
        setSelectedNote,
        addNote,
        updateNote,
        deleteNote,
        togglePin,
        addTag,
        encryptNoteContent,
        decryptNoteContent,
      }}
    >
      {children}
    </NoteProviderContext.Provider>
  );
}

export default NoteProvider;
