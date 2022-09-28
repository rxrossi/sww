import { EventInput, IncomingEvent } from "src/sdk/application/events";
import {
  EmitEvent,
  EventHandler,
} from "src/sdk/application/io-client/base-io-client";
import { GroupsRepository } from "../../repository";
import { InvitesRepository } from "./repository";

export type Invite = {
  id: string;
  toJoin: {
    groupId: string;
    name: string;
  };
  to: {
    walletAddress: string;
  };
  from: {
    walletAddress: string;
  };
};

export type NewInviteOutgoing = EventInput<Invite, "groups-invites:invite">;

export type NewInviteIncoming = IncomingEvent<Invite>;

type InvitesDeps = {
  groupsRepository: GroupsRepository;
  emitEvent: EmitEvent<NewInviteOutgoing>;
  invitesRepository: InvitesRepository;
};

export class Invites {
  constructor(private deps: InvitesDeps) {}

  invite = ({ groupId, address }: { groupId: string; address: string }) => {
    const groupName = this.deps.groupsRepository.getById(groupId)?.name;

    if (!groupName) {
      console.error("Could not find group to invite", {
        invitee: address,
        groupId,
      });
      throw new Error("Could not find group to invite");
    }

    const payload = {
      //TODO
      id: "invite-id",
      toJoin: {
        groupId,
        name: groupName,
      },
      from: {
        walletAddress: "address1",
      },
      to: {
        walletAddress: address,
      },
    };

    this.deps.emitEvent(
      {
        data: {
          payload: payload,
          //TODO: get address in a different way
          createdBy: "address1",
          timestamp: Date.now(),
          type: "groups-invites:invite",
        },
        ulid: "ulid",
      },
      address
    );
  };

  list = () => {
    return this.deps.invitesRepository.list();
  };
}

export class InvitesEventHandler {
  constructor(
    private deps: {
      invitesRepository: InvitesRepository;
    }
  ) {}

  eventHandler: EventHandler<IncomingEvent> = (event) => {
    const isNewInvite = event.payload.data.type === "groups-invites:invite";

    if (isNewInvite) {
      this.deps.invitesRepository.create(event.payload.data.payload);
    }
  };
}
