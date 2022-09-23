import { MessagesRepository } from "../application/messages-repository";
import { Store, OnMessage } from "../application/store";
import { Message } from "../domain/message";

export class StoreImplementation implements Store {
  constructor(private messagesRepository: MessagesRepository) {}
  private onMessageCallbacks: Array<OnMessage> = [];

  async add(message: Message): Promise<void> {
    this.messagesRepository.add(message);
    this.onMessageCallbacks.forEach((cb) => cb(message));
  }

  async getAll(): Promise<Message[]> {
    return this.messagesRepository.getAll();
  }

  async getByTopic(topicId: string): Promise<Message[]> {
    return this.messagesRepository.getByTopic(topicId);
  }

  async updateMetadata(
    ulid: string,
    metadata: Message["metadata"]
  ): Promise<void> {
    await this.messagesRepository.updateMetadata(ulid, metadata);
  }

  addOnMessage(onMessage: OnMessage): void {
    this.onMessageCallbacks.push(onMessage);
  }
}
