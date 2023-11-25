import {postData} from '../api/OpenAiApi';
import {ChatRepository, Message} from '../domain/ChatInterface';

interface OpenAiChatRepositoryProps {
  chatgptUrl: string;
}

export class OpenAiChatRepository implements ChatRepository {
  private readonly chatgptUrl: string;

  constructor(props: OpenAiChatRepositoryProps) {
    this.chatgptUrl = props.chatgptUrl;
  }

  async callApi(messages: Message[]): Promise<Message[]> {
    try {
      const response = await postData(this.chatgptUrl, {
        model: 'gpt-3.5-turbo',
        messages,
      });

      const answer = response?.choices[0]?.message?.content;
      const newMessages = [
        ...messages,
        {role: 'assistant', content: answer.trim()},
      ];
      console.log('newMessages ', newMessages);

      return Promise.resolve(newMessages);
    } catch (error) {
      console.error('Error calling Chat API:', error);
      return Promise.reject(error);
    }
  }
}
