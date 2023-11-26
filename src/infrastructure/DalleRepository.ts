import {postData} from '../api/OpenAiApi';
import {DalleRepository} from '../domain/DalleInterface';
import {DALLE_URL} from '../constants/environment';

export class OpenAiDalleRepository implements DalleRepository {
  private readonly dalleUrl: string;

  constructor() {
    this.dalleUrl = DALLE_URL;
  }

  async callApi(prompt: string): Promise<string> {
    try {
      const response = await postData(this.dalleUrl, {
        prompt,
        n: 1,
        size: '512x512',
      });
      const url = response?.data[0]?.url;
      return Promise.resolve(url);
    } catch (error) {
      console.error('Error calling DALL-E API:', error);
      return Promise.reject(error);
    }
  }
}
