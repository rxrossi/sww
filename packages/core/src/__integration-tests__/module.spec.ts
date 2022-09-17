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

  describe("as inviter", () => {
    test("creates an invite", async () => {
      const client1 = buildApp("address1", dependencyType);
      const client2 = buildApp("address2", dependencyType);

      client1.e2ee.handshakeWith("address1");

      client1.e2ee.handshakeWith("address2");
      client2.e2ee.handshakeWith("address1");

      await wait();

      expect(client1.e2ee.areKeysExchangedWith("address1")).toEqual(true);
      expect(client1.e2ee.areKeysExchangedWith("address2")).toEqual(true);
      expect(client2.e2ee.areKeysExchangedWith("address1")).toEqual(true);

      client1.invites.createInvite({
        from: { walletAddress: "address1", name: "User 1" },
        to: { walletAddress: "address2", name: "User 2" },
        toJoinGroup: "group_id",
      });
      await wait(700);

      expect(await client2.invites.listInvites()).toEqual([
        {
          //TODO: fix id
          id: "something",
          from: { walletAddress: "address1", name: "User 1" },
          to: { walletAddress: "address2", name: "User 2" },
          toJoinGroup: "group_id",
          status: "pending",
        },
      ]);
    });

    test("invitee can accept an invite", async () => {
      // const inviter = buildTestSDK();
      // const invitee = buildTestSDK();
      //
      // inviter.createInvite({
      //   from: { walletAddress: "user_1_wallet_address", name: "User 1" },
      //   to: { walletAddress: "user_2_wallet_address", name: "User 2" },
      //   toJoinGroup: "group_id",
      // });
      //
      // const inviteeInvites = await invitee.listInvites();
      // expect(inviteeInvites).toEqual([
      //   {
      //     id: "something",
      //     from: { walletAddress: "user_1_wallet_address", name: "User 1" },
      //     to: { walletAddress: "user_2_wallet_address", name: "User 2" },
      //     toJoinGroup: "group_id",
      //     status: "pending",
      //   },
      // ]);
      //
      // invitee.accept(inviteeInvites[0].id);
      //
      // await wait();
      //
      // expect(await inviter.listInvites()).toEqual([
      //   {
      //     id: "something",
      //     from: { walletAddress: "user_1_wallet_address", name: "User 1" },
      //     to: { walletAddress: "user_2_wallet_address", name: "User 2" },
      //     toJoinGroup: "group_id",
      //     status: "accepted",
      //   },
      // ]);
      //
      // expect(await invitee.listInvites()).toEqual([
      //   {
      //     id: "something",
      //     from: { walletAddress: "user_1_wallet_address", name: "User 1" },
      //     to: { walletAddress: "user_2_wallet_address", name: "User 2" },
      //     toJoinGroup: "group_id",
      //     status: "accepted",
      //   },
      // ]);
    });
  });
});
