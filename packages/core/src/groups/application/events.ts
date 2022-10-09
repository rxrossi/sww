import { Evt } from "src/shared/event";

type Group = {
  id: string;
  name: string;
  description: string;
};

//TODO: no using the type for "type"
export type NewGroupIncoming = Evt<Group, "groups:new">;

export type EventType = "groups:new";
