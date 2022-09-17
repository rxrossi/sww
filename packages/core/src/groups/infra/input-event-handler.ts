import { IOClient, IOEvent } from "src/shared/application/ioClient";
import {
  CreateGroup,
  GroupIOEvent,
  isCreateGroupIOEvent,
} from "../application/events";
import { GroupsRepository } from "../application/groups-repository";

export class InputEventHandler {
  private ioClient: IOClient<GroupIOEvent["payload"]>;

  constructor(ioClient: IOClient, private repository: GroupsRepository) {
    this.ioClient = ioClient;

    this.ioClient.addOnEventHandler(this.eventHandler);
  }

  private onCreate(event: CreateGroup) {
    this.repository.create({
      name: event.payload.name,
      id: event.payload.groupId,
    });
  }

  private eventHandler = async (event: IOEvent) => {
    if (isCreateGroupIOEvent(event)) {
      this.onCreate(event);
    }
  };
}
