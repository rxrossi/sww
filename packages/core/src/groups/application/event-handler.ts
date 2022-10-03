import { EventHandler } from "src/sdk/application/io-client/application/base-io-client";
import { Evt } from "src/shared/event";
import { EventType } from "./events";
import { GroupsRepository } from "./repository";

export class GroupsEventHandler {
  constructor(
    private deps: {
      repository: GroupsRepository;
    }
  ) {}

  eventHandler: EventHandler<Evt> = (event) => {
    const newGroupEventType: EventType = "groups:new";

    switch (event.payload.data.type) {
      case newGroupEventType: {
        this.deps.repository.create(event.payload.data.payload);
        break;
      }
    }
  };
}
