import { createServer } from "http";
import { buildIOServer, msgStore } from "../server";
import { buildTestClient, wait } from "../test-utils";

const httpServer = createServer();
buildIOServer(httpServer);
httpServer.listen(9978);

const client1 = buildTestClient("1");
const client2 = buildTestClient("2");
const client3 = buildTestClient("3");

beforeEach(() => {
  jest.clearAllMocks();
  msgStore.clear();
});

afterAll(async () => {
  client1.client.io.disconnect();
  client2.client.io.disconnect();
  client3.client.io.disconnect();
  httpServer.close();
  await wait();
});

describe("Sending message to specific clients", () => {
  test("only the destination client receives the message", async () => {
    const payload = "message to client";

    client1.client.sendEvent({ payload, to: "2", eventULID: "ulid" });

    await wait();

    expect(client1.spies.onEvent).not.toHaveBeenCalled();
    expect(client3.spies.onEvent).not.toHaveBeenCalled();

    expect(client2.spies.onEvent).toHaveBeenCalledWith(
      {
        payload,
        eventULID: "ulid",
        from: "1",
        acknowledged: false,
      },
      expect.any(Function)
    );

    expect(await msgStore.read({ to: "1" })).toEqual([]);
    expect(await msgStore.read({ to: "2" })).toEqual([
      {
        to: "2",
        payload: "message to client",
        eventULID: "ulid",
        from: "1",
        timestamp: expect.any(Number),
        acknowledged: false,
      },
    ]);

    const [[event, callback]] = (client2.spies.onEvent as jest.Mock).mock.calls;

    expect(event).toEqual({
      payload: "message to client",
      eventULID: "ulid",
      from: "1",
      acknowledged: false,
    });

    callback(true);

    await wait();

    expect(await msgStore.read({ to: "2" })).toEqual([
      {
        to: "2",
        payload: "message to client",
        eventULID: "ulid",
        from: "1",
        timestamp: expect.any(Number),
        acknowledged: true,
      },
    ]);
  });
});

describe("Client can send messages to himself", () => {
  test("if the sender and receiver are the same, the server does not send the message back, until the client reconnects/asks for it", async () => {
    const payload = "message to client";

    client1.client.sendEvent({ payload, to: "1", eventULID: "ulid" });
    await wait();

    expect(client1.spies.onEvent).not.toHaveBeenCalled();

    client1.client.asksForPersistedMessages();
    await wait();

    expect(client1.spies.onEvent).toHaveBeenCalledTimes(1);
  });
});

describe("Persisting messages", () => {
  describe("asksForPersistedMessages", () => {
    test("a client receives a message when reconnecting", async () => {
      client2.client.disconnect();

      client1.client.sendEvent({
        payload: "payload1",
        eventULID: "ulid1",
        to: "2",
      });
      client1.client.sendEvent({
        payload: "payload2",
        eventULID: "ulid2",
        to: "2",
      });

      client2.client.io.connect();
      client2.client.asksForPersistedMessages();
      await wait();

      expect(client2.spies.onEvent).toHaveBeenCalledWith(
        {
          payload: "payload1",
          eventULID: "ulid1",
          from: "1",
          acknowledged: false,
        },
        expect.any(Function)
      );

      expect(client2.spies.onEvent).toHaveBeenCalledWith(
        {
          payload: "payload2",
          eventULID: "ulid2",
          from: "1",
          acknowledged: false,
        },
        expect.any(Function)
      );

      const [[_event1, callback1], [_event2, callback2]] =
        client2.spies.onEvent.mock.calls;

      callback1(true);
      await wait();
      expect(await msgStore.read({ to: "2" })).toEqual([
        {
          to: "2",
          payload: "payload1",
          eventULID: "ulid1",
          from: "1",
          acknowledged: true,
          timestamp: expect.any(Number),
        },
        {
          to: "2",
          payload: "payload2",
          eventULID: "ulid2",
          from: "1",
          acknowledged: false,
          timestamp: expect.any(Number),
        },
      ]);

      callback2(true);
      await wait();
      expect(await msgStore.read({ to: "2" })).toEqual([
        {
          to: "2",
          payload: "payload1",
          eventULID: "ulid1",
          from: "1",
          acknowledged: true,
          timestamp: expect.any(Number),
        },
        {
          to: "2",
          payload: "payload2",
          eventULID: "ulid2",
          from: "1",
          acknowledged: true,
          timestamp: expect.any(Number),
        },
      ]);
    });

    test.todo("a client receives only the messages that he belongs to him");
    test.todo("a client can ask for events after a given timestamp");
  });
});
