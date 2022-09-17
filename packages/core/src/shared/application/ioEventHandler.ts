import { IOEvent } from "./ioClient";

export interface IOEventHandler {
  onEvent(event: IOEvent): void;
}
