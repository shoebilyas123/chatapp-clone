export interface IChatInfo {
  _id: string;
  name: string;
  avatarColor: string;
  profilePic?: string;
  chatHistory?: any;
  chatsLoading: boolean;
  chatsSuccess: boolean;
  chatsError: string;
  socket?: any;
}
