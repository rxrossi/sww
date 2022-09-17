import { IOClient } from "src/shared/application/ioClient";
import {
  InviteIOEvent,
  InviteIOEventType,
  NewInviteIOEvent,
} from "src/invites/application/ioEvents";
import { ListInvitesUseCase } from "../application/use-cases/list-invites";

export class InviteSDK {
  private ioClient: IOClient<InviteIOEvent["payload"]>;

  constructor(
    ioClient: IOClient,
    private listInvitesUseCase: ListInvitesUseCase
  ) {
    this.ioClient = ioClient;
  }

  listInvites = () => {
    return this.listInvitesUseCase.execute();
  };

  createInvite(
    input: Omit<NewInviteIOEvent["payload"], "id" | "status" | "type">
  ) {
    // TODO: should get the recipients from the payload
    // will probably receive a members or use case

    this.ioClient.send(
      {
        ulid: "ulid",
        payload: {
          ...input,
          type: InviteIOEventType.new,
          id: "something",
          status: "pending",
        },
      },
      [
        { walletAddress: input.to.walletAddress },
        { walletAddress: this.ioClient.getAddress() },
      ]
    );
  }

  async accept(inviteId: string) {
    const invites = await this.listInvitesUseCase.execute();
    const invite = invites.find((it) => it.id === inviteId);

    if (!invite) {
      console.log("Could not find invite", { id: inviteId });
      return;
    }

    this.ioClient.send(
      {
        ulid: "ulid",
        payload: {
          inviteId,
          type: InviteIOEventType.accept,
        },
      },
      [
        { walletAddress: invite.from.walletAddress },
        { walletAddress: this.ioClient.getAddress() },
      ]
    );
  }
}
