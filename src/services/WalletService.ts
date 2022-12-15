import WalletConnectProvider from "@walletconnect/web3-provider";

export class WalletService {
  provider: any;

  public async connect() {
    this.provider = await this.getProvider();
  }

  private async getProvider() {
    let provider = null;

    if (window.ethereum) {
      provider = window.ethereum;

      /** Return provider to use */
      return provider;
    } else {
      /** Create WalletConnect Provider */
      provider = new WalletConnectProvider({
        infuraId: "9bf71860bc6c4560904d84cd241ab0a0",
      });

      /** Enable session (triggers QR Code modal) */
      await provider.enable();

      /** Return provider to use */
      return provider;
    }
  }
}
