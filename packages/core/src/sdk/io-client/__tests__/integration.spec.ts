import { buildWithHTTPServer } from "@sww/ws-server";
import { Client as WsClient } from "@sww/ws-client";
import { build } from "..";

const port = 9992;
const buildTestClient = () =>
  build(
    new WsClient({
      socketIoOptions: [
        `http://localhost:${port}`,
        {
          autoConnect: false,
        },
      ],
    })
  ).ioClient;

const wait = (time = 300) =>
  new Promise((resolve) => {
    setTimeout(() => resolve(null), time);
  });

describe("IO Client with E2EE", () => {
  let server: ReturnType<typeof buildWithHTTPServer>;
  beforeAll(async () => {
    server = buildWithHTTPServer(port);
    await wait(500);
  });

  afterAll(async () => {
    server.teardown();
    await wait();
  });

  const client1Address = "address 1";
  const client2Address = "address 2";

  const onEventClient1 = jest.fn();
  const client1 = buildTestClient();

  const onEventClient2 = jest.fn();
  const client2 = buildTestClient();

  beforeEach(() => {
    client1.connect({ address: client1Address, signedMessage: "" });
    client1.addEventHandler(onEventClient1);

    client2.connect({ address: client2Address, signedMessage: "" });
    client2.addEventHandler(onEventClient2);
  });

  afterEach(() => {
    client1.disconnect();
    client2.disconnect();
  });

  it("can exchange keys and then sync", async () => {
    const event = {
      data: { type: "type", groupId: "", payload: "_PAYLOAD_", timestamp: 1 },
      ulid: "ulid",
    };

    client1.emitEvent(event, [client2Address]);

    await wait();

    expect(onEventClient1).toHaveBeenCalledTimes(1);
    expect(onEventClient1).toHaveBeenCalledWith({
      ...event,
      ioData: {
        meantToBeSentTo: ["address 2", "address 1"],
        sentTo: ["address 1"],
        timestamp: expect.any(Number),
      },
      sentFrom: "address 1",
    });

    expect(onEventClient2).toHaveBeenCalledTimes(1);
    expect(onEventClient2).toHaveBeenCalledWith({
      ...event,
      ioData: {
        meantToBeSentTo: ["address 1", "address 2"],
        sentTo: ["address 1", "address 2"],
        timestamp: expect.any(Number),
      },
      sentFrom: "address 1",
    });
  });
});
