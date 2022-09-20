export interface Sync {
  syncMessages(topicId: string, address: string): Promise<void>;
}
