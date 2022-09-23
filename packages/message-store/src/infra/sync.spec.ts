import * as JestDateMock from "jest-date-mock";
import { MessagesRepositoryEntry } from "../application/messages-repository";
import { MessagesRepositoryInMemory } from "./messages-repository-in-memory";
import { StoreImplementation } from "./store-in-memory";
import { SyncImplementation } from "./sync";

const wait = (timeMs?: number) =>
  new Promise((resolve) => setTimeout(() => resolve(null), timeMs || 50));

const buildTestClient = () => {
  const messagesRepository = new MessagesRepositoryInMemory();
  const store = new StoreImplementation(messagesRepository);
  const sendMessage = jest.fn();
  const sync = new SyncImplementation(store, sendMessage);

  return {
    repository: messagesRepository,
    sendMessage,
    store,
    sync,
  };
};

describe("Message Sync", () => {
  JestDateMock.advanceTo("2010-10-10");

  describe("sends the out-of-sync messages to every participant received from Participants", () => {
    test("when the address to sync with is missing from the metadata.sentTo", async () => {
      const participants = ["p1", "p2", "p3"];
      const topicId = "TOPIC_1";
      const client = buildTestClient();

      const messages: Array<MessagesRepositoryEntry> = [
        {
          topicId,
          data: { data: 1 },
          sentFrom: participants[0],
          metadata: {
            sentTo: [
              { address: participants[0] },
              { address: participants[1] },
            ],
            timestamp: Date.now(),
          },
          ulid: "_ULID_1_",
        },
      ];

      await client.store.add(messages[0]);

      await client.sync.syncMessages(topicId, participants[2]);

      await wait();

      expect(client.sendMessage.mock.calls).toHaveLength(1);
      expect(client.sendMessage).toHaveBeenCalledWith(
        {
          ...messages[0],
          metadata: {
            sentTo: [{ address: "p1" }, { address: "p2" }, { address: "p3" }],
            timestamp: Date.now(),
          },
        },
        [participants[2]]
      );

      expect(await client.store.getByTopic(topicId)).toEqual([
        {
          ...messages[0],
          metadata: {
            sentTo: [{ address: "p1" }, { address: "p2" }, { address: "p3" }],
            timestamp: Date.now(),
          },
        },
      ]);
    });
  });

  test("does not send messages that are related to a different topic", async () => {
    const participants = ["p1", "p2", "p3"];
    const topicId = "TOPIC_1";
    const client = buildTestClient();

    const messages: Array<MessagesRepositoryEntry> = [
      {
        topicId,
        data: { data: 1 },
        sentFrom: participants[0],
        metadata: {
          sentTo: [{ address: participants[0] }, { address: participants[1] }],
          timestamp: Date.now(),
        },
        ulid: "_ULID_1_",
      },
    ];

    await client.store.add(messages[0]);

    await client.sync.syncMessages("another_topic", participants[2]);

    await wait();

    expect(client.sendMessage.mock.calls).toHaveLength(0);
    expect(await client.store.getByTopic(topicId)).toEqual(messages);
  });

  test("does not send any message if all messages are already-synced", async () => {
    const participants = ["p1", "p2"];
    const topicId = "TOPIC_1";
    const client = buildTestClient();

    const messages: Array<MessagesRepositoryEntry> = [
      {
        topicId,
        data: { data: 1 },
        sentFrom: participants[0],
        metadata: {
          sentTo: [{ address: participants[0] }, { address: participants[1] }],
          timestamp: Date.now(),
        },
        ulid: "_ULID_1_",
      },
    ];

    await client.store.add(messages[0]);

    await client.sync.syncMessages(topicId, participants[1]);

    await wait();

    expect(client.sendMessage.mock.calls).toHaveLength(0);
    expect(await client.store.getByTopic(topicId)).toEqual(messages);
  });
});
