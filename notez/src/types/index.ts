export type Note = {
  id: string;
  userId?: string; // Optional for backward compatibility
  title: string;
  content: string;
  updatedAt: Date;
  createdAt?: Date;
  pinned: boolean;
  tags: string[];
  isEncrypted: boolean;
  encryptedContent?: string;
};
