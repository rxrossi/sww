import { IOClient, IOEvent } from "src/shared/application/ioClient";
import { IOEventHandler } from "src/shared/application/ioEventHandler";
import {
  isAcceptInviteIOEvent,
  isNewInviteIOEvent,
} from "../application/ioEvents";
import { AcceptInviteUseCase } from "../application/use-cases/accept-invite";
import { NewInviteUseCase } from "../application/use-cases/new-invite";

export class InvitesIOEventHandler implements IOEventHandler {
  constructor(
    private ioClient: IOClient,
    private newInviteUseCase: NewInviteUseCase,
    private acceptInviteUseCase: AcceptInviteUseCase
  ) {
    this.ioClient.addOnEventHandler(this.onEvent);
  }

  onEvent = (event: IOEvent): void => {
    if (isAcceptInviteIOEvent(event)) {
      this.acceptInviteUseCase.execute(event.payload.inviteId);
    } else if (isNewInviteIOEvent(event)) {
      this.newInviteUseCase.execute(event.payload);
    }
  };
}
