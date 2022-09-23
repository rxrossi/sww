import { Store } from "../application/store";
import { Sync } from "../application/sync";
import { Message } from "../domain/message";

type SendMessage = (message: Message, toAddresses: string[]) => void;

export class SyncImplementation implements Sync {
  constructor(private store: Store, private sendMessage: SendMessage) {}

  async syncMessages(
    topicId: string,
    addressToSyncWith: string
  ): Promise<void> {
    const messages = await this.store.getByTopic(topicId);
    messages.forEach((m) => {
      if (m.metadata.sentTo.find((it) => it.address === addressToSyncWith)) {
        return;
      }

      const newSentTo: Message["metadata"]["sentTo"] = [
        ...m.metadata.sentTo,
        { address: addressToSyncWith },
      ];

      const newMetadata: Message["metadata"] = {
        sentTo: newSentTo,
        timestamp: Date.now(),
      };

      try {
        this.sendMessage(
          { ...m, metadata: newMetadata },
          newSentTo.map((it) => it.address)
        );
      } catch (e) {
        console.error("Error sending messages", {
          message: m,
          sendingTo: newSentTo,
        });
      } finally {
        this.store.updateMetadata(m.ulid, newMetadata);
      }
    });
  }
}
