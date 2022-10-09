import { Ids } from "src/ids";
import { EmitEvent } from "src/sdk/io-client/types";
import { EventType } from "./events";
import { GroupsRepository } from "./repository";

export type Group = {
  id: string;
  name: string;
};

type Dependencies = {
  repository: GroupsRepository;
  emitEvent: EmitEvent;
  ids: Ids;
};

export class Groups {
  constructor(private deps: Dependencies) {}

  list() {
    return this.deps.repository.list();
  }

  create({ name }: { name: string }) {
    const payload = {
      id: this.deps.ids.id(),
      name,
    };
    const type: EventType = "groups:new";
    this.deps.emitEvent(
      {
        ulid: "TODO",
        data: {
          groupId: payload.id,
          payload,
          timestamp: Date.now(),
          type,
        },
      },
      []
    );
  }
}
