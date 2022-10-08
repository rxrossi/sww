import { Client as WsClient } from "@sww/ws-client";
import { build } from "..";

const buildTestClient = () =>
  build(
    new WsClient({
      socketIoOptions: ["http://localhost:9977"],
    })
  );

const wait = () =>
  new Promise((resolve) => {
    setTimeout(() => resolve(null), 1000);
  });

describe("IO Client with E2EE", () => {
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

    return;
    // console.log("client 1", JSON.stringify(onEventClient1.mock.calls, null, 2));
    // console.log("client 2", JSON.stringify(onEventClient2.mock.calls, null, 2));
    // return;

    expect(onEventClient1).toHaveBeenCalledTimes(2);
    expect(onEventClient1).toHaveBeenNthCalledWith(1, {
      publicKey: expect.anything(),
      sentFrom: client1Address, // sent the event to himself
      type: "exchange-keys",
    });
    expect(onEventClient1).toHaveBeenNthCalledWith(2, {
      publicKey: expect.anything(),
      sentFrom: client2Address, // received event from client 2
      type: "exchange-keys",
    });

    expect(onEventClient2).toHaveBeenCalledTimes(2);
    expect(onEventClient1).toHaveBeenNthCalledWith(1, {
      publicKey: expect.anything(),
      sentFrom: client1Address, // received the event from client 1
      type: "exchange-keys",
    });
    expect(onEventClient1).toHaveBeenNthCalledWith(2, {
      publicKey: expect.anything(),
      sentFrom: client2Address, // sent the event to himself
      type: "exchange-keys",
    });
  });
});
