// Goal: have a client that sends messages other clients with the given address

import { IOClientSharedNodeProcess } from "./ioClientSharedNodeProcess";

const buildTestClient = (walletAddress: string) => {
  const client = new IOClientSharedNodeProcess(walletAddress);
  const onEvent = jest.fn();

  client.addOnEventHandler(onEvent);

  return {
    client,
    onEvent,
  };
};

describe("IO Client Shared Node.js Process", () => {
  test("can send messages to other clients", () => {
    const client1 = buildTestClient("1");
    const client2 = buildTestClient("2");
    const client3 = buildTestClient("3");
    const client4 = buildTestClient("4");

    client1.client.sendEvent(
      { data: "DATA", metadata: "METADATA", ulid: "ULID" },
      [
        { walletAddress: client2.client.getAddress() },
        { walletAddress: client4.client.getAddress() },
      ]
    );

    expect(client2.onEvent).toHaveBeenCalledTimes(1);
    expect(client2.onEvent).toHaveBeenCalledWith({
      data: "DATA",
      metadata: "METADATA",
      sentFrom: client1.client.getAddress(),
      ulid: "ULID",
    });

    expect(client4.onEvent).toHaveBeenCalledTimes(1);
    expect(client4.onEvent).toHaveBeenCalledWith({
      data: "DATA",
      metadata: "METADATA",
      sentFrom: client1.client.getAddress(),
      ulid: "ULID",
    });

    expect(client1.onEvent).not.toHaveBeenCalled();
    expect(client3.onEvent).not.toHaveBeenCalled();
  });
});
