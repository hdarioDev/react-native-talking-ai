export interface Message {
  role: string;
  content: string;
}

export interface ChatRepository {
  callApi(messages: Message[]): Promise<Message[]>;
}
