export class Auth {
  private walletAddress?: string;

  constructor() {}

  auth(walletAddress: string) {
    this.walletAddress = walletAddress;
  }

  getWalletAddress(): string {
    if (!this.walletAddress) {
      throw new Error("asking for wallet address before it has been defined");
    }

    return this.walletAddress;
  }
}
