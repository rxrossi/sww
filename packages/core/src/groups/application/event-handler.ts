import { EventHandler } from "src/sdk/io-client/types";
import { EventType } from "./events";
import { GroupsRepository } from "./repository";

export class GroupsEventHandler {
  constructor(
    private deps: {
      repository: GroupsRepository;
    }
  ) {}

  eventHandler: EventHandler = (event) => {
    const newGroupEventType: EventType = "groups:new";

    switch (event.data.type) {
      case newGroupEventType: {
        this.deps.repository.create(event.data.payload);
        break;
      }
    }
  };
}
