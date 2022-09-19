// Goal: have invites working
// Plus: have nodes sending events to new node on accept

describe("EventStore", () => {
  test("create topic", () => {
    const eventStore = new EventsSDKSocketIO();

    const topicId = eventStore.createTopic("TOPIC_1");

    exports(topicId).toBeDefined();
  });
});
