import { Store, OnMessage } from "../application/store";
import { Message } from "../domain/message";

//TODO: It does not need to be MessageStoreInMemory, it should receive a messages repository
export class MessageStoreInMemory implements Store {
  private messages: Array<Message> = [];
  private onMessageCallbacks: Array<OnMessage> = [];

  async add(message: Message): Promise<void> {
    this.messages.push(message);
    this.onMessageCallbacks.forEach((cb) => cb(message));
  }

  async getAll(): Promise<Message[]> {
    return this.messages;
  }

  async getByTopic(topicId: string): Promise<Message[]> {
    return this.messages.filter((message) => message.topicId === topicId);
  }

  async update(ulid: string, metadata: Message["metadata"]): Promise<void> {
    const arrayIndexToUpdate = this.messages.findIndex(
      (message) => message.ulid === ulid
    );

    this.messages[arrayIndexToUpdate] = {
      ...this.messages[arrayIndexToUpdate],
      metadata,
    };
  }

  addOnMessage(onMessage: OnMessage): void {
    this.onMessageCallbacks.push(onMessage);
  }
}
