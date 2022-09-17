import { IOEvent } from "src/shared/application/ioClient";

export enum GroupIOEventType {
  new = "group:new",
  delete = "group:delete",
}

export type GroupIOEvent = CreateGroup | DeleteGroup;

export type CreateGroup = {
  ulid: string;
  sentFrom: string;
  payload: {
    type: GroupIOEventType.new;
    groupId: string;
    name: string;
  };
};

export type DeleteGroup = {
  ulid: string;
  sentFrom: string;
  payload: {
    type: GroupIOEventType.delete;
  };
};

export const isCreateGroupIOEvent = (event: IOEvent): event is CreateGroup => {
  return event?.payload.type === GroupIOEventType.new;
};
