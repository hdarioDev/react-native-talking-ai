import AsyncStorage from '@react-native-async-storage/async-storage';
import {StorageRepository} from '../domain/StorageInterface';

export class AsyncStorageRepository implements StorageRepository {
  async saveQuestionCount(count: number): Promise<void> {
    try {
      await AsyncStorage.setItem('dailyQuestionCount', count.toString());
    } catch (error) {
      console.error('Error saving question count:', error);
    }
  }

  async getQuestionCount(): Promise<number> {
    try {
      const count: string =
        (await AsyncStorage.getItem('dailyQuestionCount')) || '0';
      return parseInt(count, 10) || 0;
    } catch (error) {
      console.error('Error getting question count:', error);
      return 0;
    }
  }

  async saveLastQuestionDate(date: string): Promise<void> {
    try {
      await AsyncStorage.setItem('lastQuestionDate', date);
    } catch (error) {
      console.error('Error saving last question date:', error);
    }
  }

  async getLastQuestionDate(): Promise<string | null> {
    try {
      return await AsyncStorage.getItem('lastQuestionDate');
    } catch (error) {
      console.error('Error getting last question date:', error);
      return null;
    }
  }
}
