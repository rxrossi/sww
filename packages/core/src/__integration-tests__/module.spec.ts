import { buildApp } from "src/app";
import { buildWithHTTPServer } from "@sww/ws-server";
import { wait } from "./test-utils";

const dependencyTypes: any[] = ["inMemory", "regular"];

describe.each(dependencyTypes)("Invite to group", (dependencyType) => {
  let server: ReturnType<typeof buildWithHTTPServer>;
  beforeAll(() => {
    if (dependencyType === "regular") {
      server = buildWithHTTPServer();
    }
  });

  afterAll(() => {
    if (dependencyType === "regular") {
      server.teardown();
    }
  });

  describe(`using ${dependencyType} dependency type`, () => {
    test("invites journey", async () => {
      const client1 = buildApp("address1", dependencyType);
      const client2 = buildApp("address2", dependencyType);

      client1.e2ee.handshakeWith("address1");
      client1.e2ee.handshakeWith("address2");
      client2.e2ee.handshakeWith("address1");
      client2.e2ee.handshakeWith("address2");

      await wait();

      expect(client1.e2ee.areKeysExchangedWith("address1")).toEqual(true);
      expect(client1.e2ee.areKeysExchangedWith("address2")).toEqual(true);
      expect(client2.e2ee.areKeysExchangedWith("address1")).toEqual(true);

      client1.invites.createInvite({
        from: { walletAddress: "address1", name: "User 1" },
        to: { walletAddress: "address2", name: "User 2" },
        toJoinGroup: "group_id",
      });
      await wait();

      expect(await client1.invites.listInvites()).toEqual([
        {
          //TODO: fix id
          id: "something",
          from: { walletAddress: "address1", name: "User 1" },
          to: { walletAddress: "address2", name: "User 2" },
          toJoinGroup: "group_id",
          status: "pending",
        },
      ]);

      const client2Invites = await client2.invites.listInvites();
      expect(client2Invites).toEqual([
        {
          //TODO: fix id
          id: "something",
          from: { walletAddress: "address1", name: "User 1" },
          to: { walletAddress: "address2", name: "User 2" },
          toJoinGroup: "group_id",
          status: "pending",
        },
      ]);

      client2.invites.accept(client2Invites[0].id);

      await wait();

      expect(await client2.invites.listInvites()).toEqual([
        {
          //TODO: fix id
          id: "something",
          from: { walletAddress: "address1", name: "User 1" },
          to: { walletAddress: "address2", name: "User 2" },
          toJoinGroup: "group_id",
          status: "accepted",
        },
      ]);

      expect(await client1.invites.listInvites()).toEqual([
        {
          //TODO: fix id
          id: "something",
          from: { walletAddress: "address1", name: "User 1" },
          to: { walletAddress: "address2", name: "User 2" },
          toJoinGroup: "group_id",
          status: "accepted",
        },
      ]);
    });
  });
});
