import {postData} from '../api/OpenAiApi';
import {DalleRepository} from '../domain/DalleInterface';

interface OpenAiDalleRepositoryProps {
  dalleUrl: string;
}

export class OpenAiDalleRepository implements DalleRepository {
  private readonly dalleUrl: string;

  constructor(props: OpenAiDalleRepositoryProps) {
    this.dalleUrl = props.dalleUrl;
    console.log('this.dalleUrl ', this.dalleUrl);
  }

  async callApi(prompt: string): Promise<string> {
    console.log('prompt FETCH ', prompt);

    try {
      const response = await postData(this.dalleUrl, {
        prompt,
        n: 1,
        size: '512x512',
      });
      console.log('response?.data[0]?.url ');

      const url = response?.data[0]?.url;
      return Promise.resolve(url);
    } catch (error) {
      console.error('Error calling DALL-E API:', error);
      return Promise.reject(error);
    }
  }
}
