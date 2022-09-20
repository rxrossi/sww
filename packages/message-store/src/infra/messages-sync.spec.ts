import { MessageStoreInMemory } from "./message-store-in-memory";
import { MessagesSyncImplementation } from "./messages-sync";

describe("Message Sync", () => {
  test("calls sendMessage correctly on topic:join", async () => {
    const participant1 = "participant1";
    const participant2 = "participant2";
    const participant3 = "participant3";
    const participant4 = "participant4";

    const sendMessage = jest.fn();
    const getTopicParticipants = jest
      .fn()
      .mockResolvedValue([
        participant1,
        participant2,
        participant3,
        participant4,
      ]);

    const messageStore = new MessageStoreInMemory();

    new MessagesSyncImplementation(
      messageStore,
      sendMessage,
      getTopicParticipants
    );

    messageStore.add({
      ulid: "_ULID_2_",
      topicId: "_TOPIC_ID_",
      sentFrom: participant2,
      data: {
        type: "irrelevant",
      },
      metadata: {
        sentTo: [participant1, participant2],
        timestamp: Date.now(),
      },
    });

    messageStore.add({
      ulid: "_ULID_2_",
      topicId: "_TOPIC_ID_",
      sentFrom: participant4,
      data: {
        type: "topic:join",
      },
      metadata: {
        sentTo: [participant1, participant2, participant3, participant4],
        timestamp: Date.now(),
      },
    });

    await new Promise((resolve) => {
      setTimeout(() => resolve(null), 0);
    });

    expect(sendMessage).toHaveBeenCalledTimes(1);
    expect(sendMessage).toHaveBeenCalledWith(
      {
        data: { type: "irrelevant" },
        metadata: {
          sentTo: [participant1, participant2, participant3, participant4],
          timestamp: expect.any(Number),
        },
        sentFrom: participant2,
        topicId: "_TOPIC_ID_",
        ulid: "_ULID_2_",
      },
      [participant3, participant4]
    );
  });
});
