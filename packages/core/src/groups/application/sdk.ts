import { GroupsRepository } from "./repository";

export type Group = {
  id: string;
  name: string;
};

type GroupsDeps = {
  repository: GroupsRepository;
};

export class Groups {
  constructor(private deps: GroupsDeps) {}

  list() {
    return this.deps.repository.list();
  }

  create({ name }: { name: string }) {
    return this.deps.repository.create({ name });
  }
}
