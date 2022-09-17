import { E2EESdk, EncryptedMessage } from "src/e2ee/module";
import {
  IOClient,
  OnEventHandler,
  IOEvent,
  IOEventRecipient,
} from "../application/ioClient";

export class IOClientWithE2EE<Payload extends { type: string }>
  implements IOClient<any>
{
  private onEventHandlers: Array<OnEventHandler> = [];

  constructor(private baseClient: IOClient, private e2ee: E2EESdk) {
    this.baseClient.addOnEventHandler(this.handleEventWithEncryptedPayload);
  }

  addOnEventHandler(eventHandler: OnEventHandler): void {
    this.onEventHandlers.push(eventHandler);
  }

  disconnect(): void {
    this.baseClient.disconnect();
  }

  send(event: IOEvent<Payload>, recipients: IOEventRecipient[]): void {
    recipients.forEach((recipient) => {
      const encryptedPayload = this.e2ee.encrypt(
        recipient.walletAddress,
        event.payload
      );

      this.baseClient.send({ ...event, payload: encryptedPayload as any }, [
        { walletAddress: recipient.walletAddress },
      ]);
    });
  }

  getAddress(): string {
    return this.baseClient.getAddress();
  }

  private handleEventWithEncryptedPayload = ({
    payload,
    ...event
  }: IOEvent) => {
    if (!this.isEncryptedPayload(payload)) {
      return;
    }

    const decryptedPayload = this.e2ee.decrypt<IOEvent["payload"]>(
      event.sentFrom,
      payload as unknown as EncryptedMessage
    );

    this.onEventHandlers.forEach((eventHandler) => {
      eventHandler({
        ...event,
        payload: decryptedPayload,
      });
    });
  };

  private isEncryptedPayload = (
    payload: unknown
  ): payload is EncryptedMessage => {
    return (
      typeof payload === "object" && payload !== null && "cipherText" in payload
    );
  };
}
