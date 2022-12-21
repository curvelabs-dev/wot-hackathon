import WalletConnectProvider from "@walletconnect/web3-provider";
import { ethers } from "ethers";

export enum Networks {
  Ethereum = "ethereum",
  Goerli = "goerli",
  Localhost = "localhost",
}

export type AllowedNetworks =
  | Networks.Ethereum
  | Networks.Goerli
  | Networks.Localhost;

export class WalletService {
  public static ProviderEndpoints = {
    [Networks.Ethereum]:
      "https://eth-mainnet.alchemyapi.io/v2/EuGnkVlzVoEkzdg0lpCarhm8YHOxWVxE",
    [Networks.Goerli]:
      "https://goerli.infura.io/v3/96dffb3d8c084dec952c61bd6230af34",
    [Networks.Localhost]: "http://127.0.0.1:8545",
  };
  public static RPCEndpoints = {
    1: WalletService.ProviderEndpoints[Networks.Ethereum],
    5: WalletService.ProviderEndpoints[Networks.Goerli],
    31337: WalletService.ProviderEndpoints[Networks.Localhost],
  };
  public static chainIdByName = new Map<AllowedNetworks, number>([
    [Networks.Ethereum, 1],
    [Networks.Goerli, 5],
    [Networks.Localhost, 31337],
  ]);
  public static targetedNetwork = Networks.Localhost;

  public provider: any;
  public readOnlyProvider: ethers.providers.BaseProvider;

  public async connect() {
    this.provider = await this.getProvider();
  }

  private async getProvider() {
    let provider = null;

    this.readOnlyProvider = ethers.getDefaultProvider(
      WalletService.ProviderEndpoints[WalletService.targetedNetwork]
    );

    return this.readOnlyProvider
    /* prettier-ignore */ console.log('>>>> _ >>>> ~ file: WalletService.ts ~ line 41 ~ this.readOnlyProvider', this.readOnlyProvider)

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
