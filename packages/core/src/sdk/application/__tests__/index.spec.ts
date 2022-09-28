import { SDK } from "../sdk";

const buildClient = () => {
  return new SDK();
};

describe("Application", () => {
  test("creates a group", () => {
    const client = buildClient();

    client.groups.create({ name: "Algarve expenses" });

    expect(client.groups.list()).toEqual([
      { name: "Algarve expenses", id: expect.any(String) },
    ]);
  });

  test("can invite a person to a group", () => {
    const client1 = buildClient();
    client1.auth.auth("address1");

    client1.groups.create({ name: "Algarve expenses" });
    const groupId = client1.groups.list()[0].id;

    const client2 = buildClient();
    client2.auth.auth("address2");
    const client2WalletAddress = client2.auth.getWalletAddress();

    client1.groups.invite({ groupId, address: client2WalletAddress });

    expect(client1.groups.listInvites()).toEqual([
      {
        toJoin: {
          name: "Algarve expenses",
          groupId,
        },
        from: {
          walletAddress: "address1",
        },
        to: {
          walletAddress: client2WalletAddress,
        },
      },
    ]);

    return;
    expect(client2.groups.listInvites()).toEqual([
      {
        toJoin: {
          name: "Algarve expenses",
          groupId,
        },
        from: {
          walletAddress: "address1",
        },
        to: {
          walletAddress: client2WalletAddress,
        },
      },
    ]);
  });
});
