import { InvitesRepository } from "../repository";

export class ListInvitesUseCase {
  constructor(private invitesRepository: InvitesRepository) {}

  execute() {
    return this.invitesRepository.getAll();
  }
}
