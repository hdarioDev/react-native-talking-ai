import {postData} from '../api/OpenAiApi';
import {ChatRepository, Message} from '../domain/ChatInterface';
import {Roles} from '../hooks/TalkingInterface';

interface OpenAiChatRepositoryProps {
  chatgptUrl: string;
}

export class OpenAiChatRepository implements ChatRepository {
  private readonly chatgptUrl: string;

  constructor(props: OpenAiChatRepositoryProps) {
    this.chatgptUrl = props.chatgptUrl;
  }

  async callApi(
    messages: Message[],
    lenguage: string,
    selectedLevel: string,
  ): Promise<Message[]> {
    console.log('---> messages.length  ', messages.length);
    console.log('--->  lenguage ', lenguage);
    console.log('----> selectedLevel ', selectedLevel);

    let messageModified: Message[] = [];

    const isEnglishLevel = selectedLevel !== 'native' && lenguage === 'en-US';

    if (isEnglishLevel) {
      const firstUserMessage = messages[0].content;
      const modifiedFirstUserMessage = `Simulate having a conversation in English level ${selectedLevel}, and follow the conversation. ${firstUserMessage}`;

      messageModified = [
        {role: Roles.USER, content: modifiedFirstUserMessage},
        ...messages.slice(1),
      ];
    }

    try {
      const response = await postData(this.chatgptUrl, {
        model: 'gpt-3.5-turbo',
        messages: isEnglishLevel ? messageModified : messages,
      });
      const answer = response?.choices[0]?.message?.content;
      const newMessages = [
        ...messages,
        {role: Roles.ASSISTANT, content: answer.trim()},
      ];
      return Promise.resolve(newMessages);
    } catch (error) {
      console.error('Error calling Chat API:', error);
      return Promise.reject(error);
    }
  }
}
