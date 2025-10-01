export type Note = {
  id: string;
  title: string;
  content: string;
  updatedAt: Date;
  pinned: boolean;
  tags: string[];
  isEncrypted: boolean;
  encryptedContent?: string;
};
