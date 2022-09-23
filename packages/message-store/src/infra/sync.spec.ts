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
        participants
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
  test.todo("does not send messages that are related to a different topic");
  test.todo("does not send any message if all messages are already-synced");
  test.todo(
    "does not try to send messages to address that are not in the list given by Participants"
  );

  test("calls sendMessage correctly on topic:join", async () => {
    // const participant1 = "participant1";
    // const participant2 = "participant2";
    // const participant3 = "participant3";
    // const participant4 = "participant4";
    //
    // const topicId = "_TOPIC_ID_";
    //
    // const sendMessage = jest.fn();
    //
    // const messagesRepository = new MessagesRepositoryInMemory();
    // const store = new StoreImplementation(messagesRepository);
    //
    // // TODO: each message should be in a separate "test()"
    // // not really asserting anything
    // const messages = [
    //   {
    //     topicId,
    //     data: { data: 1 },
    //     metadata: {
    //       sentTo: [participant1, participant2],
    //       timestamp: Date.now(),
    //     },
    //     sentFrom: participant1,
    //     ulid: "_ULID_1_",
    //   },
    //   {
    //     topicId,
    //     data: { data: 2 },
    //     metadata: {
    //       sentTo: [participant2, participant3],
    //       timestamp: Date.now(),
    //     },
    //     sentFrom: participant2,
    //     ulid: "_ULID_2_",
    //   },
    //   {
    //     topicId,
    //     data: { data: 3 },
    //     metadata: {
    //       sentTo: [participant2, participant4],
    //       timestamp: Date.now(),
    //     },
    //     sentFrom: participant2,
    //     ulid: "_ULID_3_",
    //   },
    //   {
    //     topicId: "another_topic",
    //     data: { data: 5 },
    //     metadata: { sentTo: [participant2], timestamp: Date.now() },
    //     sentFrom: participant2,
    //     ulid: "_ULID_5_",
    //   },
    // ];
    //
    // store.add(messages[0]);
    // store.add(messages[1]);
    // store.add(messages[2]);
    // store.add(messages[3]);
    //
    // const sync = new SyncImplementation(store, sendMessage);
    //
    // sync.syncMessages(topicId, participant4);
    // await new Promise((resolve) => {
    //   setTimeout(() => resolve(null), 100);
    // });
    //
    // console.log(sendMessage.mock.calls);
    //
    // const updatedMessages = await messagesRepository.getAll();
    // console.log(JSON.stringify(updatedMessages, null, 2));
  });
});
