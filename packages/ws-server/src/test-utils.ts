import { Client } from "@sww/ws-client";

export function buildTestClient(address: string) {
  const onEvent = jest.fn();

  const client = new Client({
    socketIoOptions: ["http://localhost:9978", { autoConnect: false }],
  });

  client.addOnEvent(onEvent);

  client.connect({
    address,
    signature: "message",
  });

  return {
    client,
    spies: {
      onEvent,
    },
  };
}

export async function wait(timeMs?: number): Promise<void> {
  await new Promise((resolve) => {
    setTimeout(() => resolve(null), timeMs || 100);
  });
}
