import { buildSdk } from "../";

const buildClient = () => {
  return buildSdk();
};

const wait = (timeMs: number = 100) =>
  new Promise((resolve) => {
    setTimeout(() => {
      resolve(null);
    }, timeMs);
  });

describe("Application", () => {
  describe("Creating a group", () => {
    const client = buildClient();

    afterEach(() => {
      client.ioClient.disconnect();
    });

    test("creates a group", async () => {
      client.ioClient.connect({
        signedMessage: "message",
        address: "address1",
      });

      client.groups.create({ name: "Algarve expenses" });
      await wait();

      expect(client.groups.list()).toEqual([
        { name: "Algarve expenses", id: expect.any(String) },
      ]);
    });
  });

  describe("Inviting to a Group", () => {
    const client1 = buildClient();
    const client2 = buildClient();
    const client2WalletAddress = "address2";

    client1.ioClient.connect({
      signedMessage: "message",
      address: "address1",
    });
    client2.ioClient.connect({
      signedMessage: "message",
      address: client2WalletAddress,
    });

    afterEach(() => {
      client1.ioClient.disconnect();
      client2.ioClient.disconnect();
    });

    test("can invite a person to a group", async () => {
      client1.groups.create({ name: "Algarve expenses" });
      const groupId = client1.groups.list()[0].id;

      await wait();

      client1.invites.invite({ groupId, address: client2WalletAddress });

      await wait();

      const client1Invites = client1.invites.list();

      expect(client1Invites).toEqual([
        {
          id: expect.any(String),
          status: "pending",
          toJoin: { name: "Algarve expenses", groupId },
          from: { walletAddress: "address1" },
          to: { walletAddress: client2WalletAddress },
        },
      ]);

      expect(client2.invites.list()).toEqual([
        {
          id: expect.any(String),
          status: "pending",
          toJoin: { name: "Algarve expenses", groupId },
          from: { walletAddress: "address1" },
          to: { walletAddress: client2WalletAddress },
        },
      ]);

      client2.invites.accept({ inviteId: client1Invites[0].id });

      await wait();

      expect(client1Invites).toEqual([
        {
          id: expect.any(String),
          status: "accepted",
          toJoin: { name: "Algarve expenses", groupId },
          from: { walletAddress: "address1" },
          to: { walletAddress: client2WalletAddress },
        },
      ]);

      expect(client2.invites.list()).toEqual([
        {
          id: expect.any(String),
          status: "accepted",
          toJoin: { name: "Algarve expenses", groupId },
          from: { walletAddress: "address1" },
          to: { walletAddress: client2WalletAddress },
        },
      ]);

      // This thing should be fixed by syncing (needs the event store)
      expect(client2.groups.list()).toEqual([
        {
          id: expect.any(String),
          name: "Algarve expenses",
        },
      ]);

      //TODO:
      // 1. Asserts the status as well [x]
      // 2. client2 accepts the invite
      // 3. client1 calls the syncGroupWith()
      // 4. both clients asserts the members for that group
      // 5. Assert that client2 has the group when calling groups.list()
    });
  });
});
