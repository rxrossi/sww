import { Events } from "src/events";
import { EmitEvent } from "src/sdk/io-client/types";

export type SyncGroupWith = (groupId: string, address: string) => void;
export type SyncWithAddress = (address: string) => void;

export class EventsSync {
  constructor(
    private deps: {
      events: Events;
      emitEvent: EmitEvent;
    }
  ) {}

  syncWithAddress: SyncWithAddress = (address) => {
    const events = this.deps.events.getAllByAddress(address);
    const toSend = events.filter(
      ({ ioData }) => !ioData.sentTo.includes(address)
    );

    toSend.forEach((event) => {
      //TODO: the ioClient should update the sentTo
      //The event needs to be sent to everyone that had it, so they get the updated sentTo/meantToBeSentTo
      this.deps.emitEvent(event, event.ioData.sentTo.concat(address));
    });
  };

  syncGroupWith: SyncGroupWith = (groupId, address) => {
    const events = this.deps.events.getAllByGroupId(groupId);
    const toSend = events.filter(
      ({ ioData }) => !ioData.sentTo.includes(address)
    );

    toSend.forEach((event) => {
      //TODO: the ioClient should update the sentTo
      //The event needs to be sent to everyone that had it, so they get the updated sentTo/meantToBeSentTo
      this.deps.emitEvent(event, event.ioData.sentTo.concat(address));
    });
  };
}
