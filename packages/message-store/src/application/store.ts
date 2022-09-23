import { Message } from "../domain/message";

export type OnMessage = (message: Message) => void | Promise<void>;

export interface Store {
  add(message: Message): Promise<void>;
  updateMetadata(
    ulid: Message["ulid"],
    message: Message["metadata"]
  ): Promise<void>;
  getAll(): Promise<Array<Message>>;
  getByTopic(topicId: string): Promise<Array<Message>>;
  addOnMessage(OnMessage: OnMessage): void;
}
