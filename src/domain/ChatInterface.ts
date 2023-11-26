export interface Message {
  role: string;
  content: string;
}

export interface ChatRepository {
  callApi(
    messages: Message[],
    lenguage: string,
    selectedLevel: string,
  ): Promise<Message[]>;
}
