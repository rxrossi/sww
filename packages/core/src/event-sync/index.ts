import { Events } from "src/events";
import { EmitEvent } from "src/sdk/application/io-client/application/base-io-client";

export type SyncGroupWith = (groupId: string, address: string) => void;

export class EventsSync {
  constructor(
    private deps: {
      events: Events;
      emitEvent: EmitEvent;
    }
  ) {}

  syncGroupWith: SyncGroupWith = (groupId, address) => {
    const events = this.deps.events.getAllByGroupId(groupId);
    const toSend = events.filter(
      ({ ioData }) => !ioData.sentTo.includes(address)
    );

    toSend.forEach((event) => {
      //TODO: the ioClient should update the sentTo
      this.deps.emitEvent(event, address);
    });
  };
}
