import { IOClientSharedNodeProcess } from "src/shared/infra/ioClientSharedNodeProcess";
import { buildGroupModule } from "./module";

const buildTestModule = (walletAddress: string) => {
  const ioClient = new IOClientSharedNodeProcess(walletAddress);

  const module = buildGroupModule({
    ioClient,
  });

  return {
    address: walletAddress,
    module,
  };
};
describe("Groups Module", () => {
  test("a client can create a group", async () => {
    const client = buildTestModule("address1");

    client.module.create({
      groupId: "_GROUP_ID_",
      name: "expense group 1",
    });

    expect(await client.module.list()).toEqual([
      { id: "_GROUP_ID_", name: "expense group 1" },
    ]);
  });
});
