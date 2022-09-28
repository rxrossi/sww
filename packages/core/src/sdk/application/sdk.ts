import { Auth } from "./auth";
import { Groups } from "./groups";

export class SDK {
  groups: Groups;
  auth: Auth;

  constructor() {
    this.groups = new Groups();
    this.auth = new Auth();
  }
}
