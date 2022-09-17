import { InvitesRepository } from "../repository";

export class AcceptInviteUseCase {
  constructor(private invitesRepository: InvitesRepository) {}

  async execute(id: string) {
    const invite = await this.invitesRepository
      .getAll()
      .then((invites) => invites.find((invite) => invite.id === id));

    if (!invite) {
      throw new Error("Invite not found");
    }

    this.invitesRepository.updateById(id, {
      ...invite,
      status: "accepted",
    });
  }
}
