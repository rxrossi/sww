export type ExchangeKeysEventPayload = {
  type: "exchange-keys";
  publicKey: Uint8Array;
};

export const isExchangeKeysEventPayload = (
  payload: any
): payload is ExchangeKeysEventPayload => {
  return payload.type === "exchange-keys";
};
