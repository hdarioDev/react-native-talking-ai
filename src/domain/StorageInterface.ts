export interface StorageRepository {
  saveQuestionCount(count: number): Promise<void>;
  getQuestionCount(): Promise<number>;
  saveLastQuestionDate(date: string): Promise<void>;
  getLastQuestionDate(): Promise<string | null>;
}
