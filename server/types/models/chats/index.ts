export interface IChatHistory {
  history: Array<{
    from: string;
    to: string;
    message: string;
    attachment?: string;
    sentAt: number;
  }>;
  userId: string;
  contactId: string;
}
