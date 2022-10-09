import { SyncGroupWith } from "src/event-sync";
import { GroupsRepository } from "src/groups/application/repository";
import { Ids } from "src/ids";
import { EmitEvent, EventHandler } from "src/sdk/io-client/types";
import { InvitesRepositoryInMemory } from "../infra/repository-in-memory";
import { InvitesEventHandler } from "./event-handler";
import { InvitesSdk } from "./sdk";

export { InvitesSdk } from "./sdk";
export { InvitesEventHandler } from "./event-handler";

export const buildSdk = ({
  emitEvent,
  groupsRepository,
  addOnEvent,
  syncGroupWith,
  whoAmI,
  ids,
}: {
  emitEvent: EmitEvent;
  addOnEvent: (eventHandler: EventHandler) => void;
  groupsRepository: GroupsRepository;
  syncGroupWith: SyncGroupWith;
  //TODO: can't keep hardcoding the type every time
  whoAmI: () => string;
  ids: Ids;
}) => {
  const invitesRepository = new InvitesRepositoryInMemory();

  const sdk = new InvitesSdk({
    whoAmI,
    emitEvent,
    groupsRepository,
    invitesRepository,
    ids,
  });

  const { eventHandler } = new InvitesEventHandler({
    whoAmI,
    invitesRepository,
    syncGroupWith,
  });

  addOnEvent(eventHandler);

  return sdk;
};
