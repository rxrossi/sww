import { IOClient } from "src/shared/application/ioClient";
import {
  CreateGroup,
  GroupIOEvent,
  GroupIOEventType,
} from "./application/events";
import { GroupsRepository } from "./application/groups-repository";
import { GroupsRepositoryInMemory } from "./infra/groups-repository-in-memory";
import { InputEventHandler } from "./infra/input-event-handler";

export class GroupSDK {
  private ioClient: IOClient<GroupIOEvent["payload"]>;

  constructor(ioClient: IOClient, private repository: GroupsRepository) {
    this.ioClient = ioClient;
  }

  create = (input: Omit<CreateGroup["payload"], "type">) => {
    //TODO: maybe ioClient should generate ULIDs?
    this.ioClient.send(
      { ulid: "ulid", payload: { type: GroupIOEventType.new, ...input } },
      [{ walletAddress: this.ioClient.getAddress() }]
    );
  };

  list = async () => {
    return this.repository.getAll();
  };
}

export const buildGroupModule = ({ ioClient }: { ioClient: IOClient }) => {
  const repository = new GroupsRepositoryInMemory();
  new InputEventHandler(ioClient, repository);
  const sdk = new GroupSDK(ioClient, repository);

  return sdk;
};
