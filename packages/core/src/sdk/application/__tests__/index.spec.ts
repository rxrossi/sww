import { buildSdks } from "../sdk";

const buildClient = () => {
  return buildSdks();
};

const wait = (timeMs: number = 100) =>
  new Promise((resolve) => {
    setTimeout(() => {
      resolve(null);
    }, timeMs);
  });

describe("Application", () => {
  test("creates a group", async () => {
    const client = buildClient();
    client.ioClient.connect({ signedMessage: "message", address: "address1" });

    client.groups.create({ name: "Algarve expenses" });
    await wait();

    expect(client.groups.list()).toEqual([
      { name: "Algarve expenses", id: expect.any(String) },
    ]);

    client.ioClient.disconnect();

    await wait();
  });

  test("can invite a person to a group", async () => {
    const client1 = buildClient();
    client1.ioClient.connect({ signedMessage: "message", address: "address1" });

    client1.groups.create({ name: "Algarve expenses" });
    const groupId = client1.groups.list()[0].id;

    const client2 = buildClient();
    client2.ioClient.connect({ signedMessage: "message", address: "address2" });
    const client2WalletAddress = "address2";

    await wait();

    client1.groups.invites.invite({ groupId, address: client2WalletAddress });

    await wait();

    expect(client1.groups.invites.list()).toEqual([
      {
        id: expect.any(String),
        toJoin: { name: "Algarve expenses", groupId },
        from: { walletAddress: "address1" },
        to: { walletAddress: client2WalletAddress },
      },
    ]);

    expect(client2.groups.invites.list()).toEqual([
      {
        id: expect.any(String),
        toJoin: { name: "Algarve expenses", groupId },
        from: { walletAddress: "address1" },
        to: { walletAddress: client2WalletAddress },
      },
    ]);

    client1.ioClient.disconnect();
    client2.ioClient.disconnect();
    await wait();
  });
});
