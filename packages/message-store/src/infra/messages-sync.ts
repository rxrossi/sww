import { MessageStore } from "../application/message-store";
import { MessagesSync } from "../application/messages-sync";
import { Message } from "../domain/message";

type SendMessage = (message: Message, toAddresses: string[]) => void;

type JoinTopic = Omit<Message, "data"> & {
  data: { type: "topic:join" };
};

type GetTopicParticipantsAddresses = (
  topicId: string
) => Promise<Array<string>>;

const isJoinTopicMessage = (message: Message): message is JoinTopic => {
  return (message as JoinTopic).data.type === "topic:join";
};

export class MessagesSyncImplementation implements MessagesSync {
  constructor(
    private messageStore: MessageStore,
    private sendMessage: SendMessage,
    private getTopicParticipantsAddresses: GetTopicParticipantsAddresses
  ) {
    this.messageStore.addOnMessage(this.onMessage);
  }

  async syncMessages(topicId: string): Promise<void> {
    const topicParticipants = await this.getTopicParticipantsAddresses(topicId);

    await this.messageStore.getByTopic(topicId).then((messages) => {
      messages.forEach((message) => {
        const toSendTo = topicParticipants.filter(
          (participant) => !message.metadata.sentTo.includes(participant)
        );

        if (toSendTo.length === 0) {
          return;
        }

        const updatedMetadata = {
          ...message.metadata,
          sentTo: [...message.metadata.sentTo, ...toSendTo],
        };

        this.messageStore.update(message.ulid, updatedMetadata);

        this.sendMessage({ ...message, metadata: updatedMetadata }, toSendTo);
      });
    });
  }

  private onMessage = (message: Message) => {
    if (isJoinTopicMessage(message)) {
      this.syncMessages(message.topicId);
    }
  };
}
