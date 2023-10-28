type MessageRole = 'user' | 'assistant';

export interface Message {
  role: MessageRole;
  content: string;
}

export const dummyMessages: Message[] = [
  {
    role: 'user',
    content: 'How are you?',
  },
  {
    role: 'assistant',
    content: 'I am fine, how may help you?',
  },
  {
    role: 'user',
    content: 'create an image of a dog playing th cat',
  },
  {
    role: 'assistant',
    content:
      'https://storage.googleapis.com/pai-images/ae74b3002bfe4b538493ca7aedb6a300.jpeg',
  },
];
