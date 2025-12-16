"use client";

import { Note } from "@/types";
import { createContext, useEffect, useState, useRef } from "react";
import { encryptNote, decryptNote } from "@/lib/encryption";
import { notesApi } from "@/lib/api";

type NoteProviderContextType = {
  notes: Note[];
  setNotes: (notes: Note[]) => void;
  selectedNote: Note | null;
  setSelectedNote: (note: Note | null) => void;
  addNote: (note: Note) => Promise<Note>;
  updateNote: (
    noteId: string,
    data: {
      title?: string;
      content?: string;
      tags?: string[];
      isEncrypted?: boolean;
      encryptedContent?: string;
    }
  ) => Promise<void>;
  deleteNote: (noteId: string) => Promise<void>;
  togglePin: (noteId: string) => Promise<void>;
  addTag: (noteId: string, tag: string) => Promise<void>;
  encryptNoteContent: (noteId: string, password: string) => Promise<void>;
  decryptNoteContent: (noteId: string, password: string) => Promise<boolean>;
  isLoading: boolean;
};

export const NoteProviderContext = createContext<NoteProviderContextType>({
  notes: [],
  setNotes: () => { },
  selectedNote: null,
  setSelectedNote: () => { },
  addNote: async () => ({} as Note),
  updateNote: async () => { },
  deleteNote: async () => { },
  togglePin: async () => { },
  addTag: async () => { },
  encryptNoteContent: async () => { },
  decryptNoteContent: async () => false,
  isLoading: false,
});

function NoteProvider({ children }: { children: React.ReactNode }) {
  const [notes, setNotes] = useState<Note[]>([]);
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  // Track update sequence numbers to prevent race conditions
  const updateSequences = useRef<Map<string, number>>(new Map());

  // Fetch notes from API on mount
  useEffect(() => {
    const fetchNotes = async () => {
      try {
        setIsLoading(true);
        const fetchedNotes = await notesApi.getAll();
        setNotes(fetchedNotes);
      } catch (error) {
        console.error("Error fetching notes:", error);
        // Fallback to localStorage if API fails
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
        } catch (localError) {
          console.error("Error loading from localStorage:", localError);
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchNotes();
  }, []);

  const addNote = async (note: Note) => {
    try {
      // If note has an id (from localStorage), create it in DB
      if (note.id) {
        const createdNote = await notesApi.create({
          title: note.title,
          content: note.content,
          tags: note.tags,
          pinned: note.pinned,
          isEncrypted: note.isEncrypted,
          encryptedContent: note.encryptedContent,
        });
        setNotes((prevNotes) => [createdNote, ...prevNotes]);
        return createdNote;
      } else {
        // New note - create in DB
        const createdNote = await notesApi.create({
          title: note.title || "Untitled",
          content: note.content || "",
          tags: note.tags || [],
          pinned: note.pinned || false,
          isEncrypted: note.isEncrypted || false,
          encryptedContent: note.encryptedContent,
        });
        setNotes((prevNotes) => [createdNote, ...prevNotes]);
        return createdNote;
      }
    } catch (error) {
      console.error("Error creating note:", error);
      // Fallback: add to local state
      setNotes((prevNotes) => [note, ...prevNotes]);
      return note;
    }
  };

  const updateNote = async (
    noteId: string,
    data: {
      title?: string;
      content?: string;
      tags?: string[];
      isEncrypted?: boolean;
      encryptedContent?: string;
    }
  ) => {
    // Increment sequence number for this note
    const currentSequence = (updateSequences.current.get(noteId) || 0) + 1;
    updateSequences.current.set(noteId, currentSequence);

    try {
      const updatedNote = await notesApi.update(noteId, data);

      // Only apply update if this is still the latest sequence
      const latestSequence = updateSequences.current.get(noteId) || 0;
      if (currentSequence < latestSequence) {
        // A newer update has started, ignore this result
        return;
      }

      setNotes((prevNotes) =>
        prevNotes.map((note) => (note.id === noteId ? updatedNote : note))
      );
      if (selectedNote?.id === noteId) {
        setSelectedNote(updatedNote);
      }
    } catch (error) {
      console.error("Error updating note:", error);

      // Only apply fallback if this is still the latest sequence
      const latestSequence = updateSequences.current.get(noteId) || 0;
      if (currentSequence < latestSequence) {
        // A newer update has started, ignore this result
        return;
      }

      // Fallback: update local state
      setNotes((prevNotes) =>
        prevNotes.map((note) =>
          note.id === noteId
            ? { ...note, ...data, updatedAt: new Date() }
            : note
        )
      );
      if (selectedNote?.id === noteId) {
        setSelectedNote({
          ...selectedNote,
          ...data,
          updatedAt: new Date(),
        });
      }
    }
  };

  const addTag = async (noteId: string, tag: string) => {
    try {
      const updatedNote = await notesApi.addTag(noteId, tag);
      setNotes((prevNotes) =>
        prevNotes.map((note) => (note.id === noteId ? updatedNote : note))
      );
      if (selectedNote?.id === noteId) {
        setSelectedNote(updatedNote);
      }
    } catch (error) {
      console.error("Error adding tag:", error);
      // Fallback: update local state
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
    }
  };

  const deleteNote = async (noteId: string) => {
    try {
      await notesApi.delete(noteId);
      setNotes((prevNotes) => prevNotes.filter((note) => note.id !== noteId));
      if (selectedNote?.id === noteId) {
        setSelectedNote(null);
      }
    } catch (error) {
      console.error("Error deleting note:", error);
      // Fallback: remove from local state
      setNotes((prevNotes) => prevNotes.filter((note) => note.id !== noteId));
      if (selectedNote?.id === noteId) {
        setSelectedNote(null);
      }
    }
  };

  const togglePin = async (noteId: string) => {
    try {
      const updatedNote = await notesApi.togglePin(noteId);
      setNotes((prevNotes) =>
        prevNotes.map((note) => (note.id === noteId ? updatedNote : note))
      );
      if (selectedNote?.id === noteId) {
        setSelectedNote(updatedNote);
      }
    } catch (error) {
      console.error("Error toggling pin:", error);
      // Fallback: update local state
      setNotes((prevNotes) =>
        prevNotes.map((note) =>
          note.id === noteId ? { ...note, pinned: !note.pinned } : note
        )
      );
      if (selectedNote?.id === noteId) {
        setSelectedNote({ ...selectedNote, pinned: !selectedNote.pinned });
      }
    }
  };

  const encryptNoteContent = async (noteId: string, password: string) => {
    try {
      const note = notes.find((n) => n.id === noteId);
      if (!note) return;

      const dataToEncrypt = JSON.stringify({
        title: note.title,
        content: note.content,
      });
      const encryptedContent = encryptNote(dataToEncrypt, password);

      const updatedNote = await notesApi.update(noteId, {
        isEncrypted: true,
        encryptedContent: encryptedContent,
        content: "",
        title: "Encrypted Note",
      });

      setNotes((prevNotes) =>
        prevNotes.map((n) => (n.id === noteId ? updatedNote : n))
      );
      if (selectedNote?.id === noteId) {
        setSelectedNote(updatedNote);
      }
    } catch (error) {
      console.error("Error encrypting note:", error);
      // Fallback: update local state
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
    }
  };

  const decryptNoteContent = async (noteId: string, password: string): Promise<boolean> => {
    try {
      const note = notes.find((n) => n.id === noteId);
      if (!note || !note.isEncrypted || !note.encryptedContent) {
        return false;
      }

      const decryptedDataString = decryptNote(note.encryptedContent, password);
      if (!decryptedDataString) {
        return false;
      }

      const decryptedData = JSON.parse(decryptedDataString);
      const updatedNote = await notesApi.update(noteId, {
        isEncrypted: false,
        encryptedContent: undefined,
        title: decryptedData.title,
        content: decryptedData.content,
      });

      setNotes((prevNotes) =>
        prevNotes.map((n) => (n.id === noteId ? updatedNote : n))
      );
      if (selectedNote?.id === noteId) {
        setSelectedNote(updatedNote);
      }
      return true;
    } catch (error) {
      console.error("Error decrypting note:", error);
      // Fallback: try local decryption
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
    }
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
        isLoading,
      }}
    >
      {children}
    </NoteProviderContext.Provider>
  );
}

export default NoteProvider;
