import { InvitesSdk } from "src/invites/application";
import { GroupsRepository } from "./repository";

export type Group = {
  id: string;
  name: string;
};

type GroupsDeps = {
  repository: GroupsRepository;
  invites: InvitesSdk;
};

export class Groups {
  invites: InvitesSdk;

  constructor(private deps: GroupsDeps) {
    this.invites = deps.invites;
  }

  list() {
    return this.deps.repository.list();
  }

  create({ name }: { name: string }) {
    return this.deps.repository.create({ name });
  }
}
