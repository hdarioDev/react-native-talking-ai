export interface DalleRepository {
  callApi(prompt: string): Promise<string>;
}
