import { GroupsRepository } from "src/groups/application/repository";
import {
  EmitEvent,
  EventHandler,
} from "src/sdk/application/io-client/application/base-io-client";
import { InvitesRepositoryInMemory } from "../infra/repository-in-memory";
import { InvitesEventHandler } from "./event-handler";
import { InvitesSdk } from "./sdk";

export { InvitesSdk } from "./sdk";
export { InvitesEventHandler } from "./event-handler";

export const buildSdk = ({
  emitEvent,
  groupsRepository,
  addOnEvent,
}: {
  emitEvent: EmitEvent;
  addOnEvent: (eventHandler: EventHandler<any>) => void;
  groupsRepository: GroupsRepository;
}) => {
  const invitesRepository = new InvitesRepositoryInMemory();

  const sdk = new InvitesSdk({
    emitEvent,
    groupsRepository,
    invitesRepository,
  });

  const { eventHandler } = new InvitesEventHandler({
    invitesRepository,
  });

  addOnEvent(eventHandler);

  return sdk;
};
