import { Ids } from "src/ids";
import {
  EmitEvent,
  EventHandler,
} from "src/sdk/application/io-client/application/base-io-client";
import { GroupsRepositoryInMemory } from "../infra/repository-in-memory";
import { GroupsEventHandler } from "./event-handler";
import { Groups } from "./sdk";

export const buildSdk = ({
  emitEvent,
  addOnEvent,
  ids,
}: {
  emitEvent: EmitEvent;
  addOnEvent: (eventHandler: EventHandler<any>) => void;
  ids: Ids;
}) => {
  const repository = new GroupsRepositoryInMemory();

  const sdk = new Groups({
    repository,
    emitEvent,
    ids,
  });

  addOnEvent(new GroupsEventHandler({ repository }).eventHandler);

  return {
    sdk,
    repository,
  };
};
