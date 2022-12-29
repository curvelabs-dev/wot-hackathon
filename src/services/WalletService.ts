import WalletConnectProvider from "@walletconnect/web3-provider";
import { ethers, Signer } from "ethers";
import { getAddress } from "ethers/lib/utils";
import { Network, Web3Provider } from "@ethersproject/providers";
import Web3Modal from "web3modal";

import { Address, DID } from "types";
import { convertToDid } from "modules/did";
import { EthereumService } from "./EthereumService";

export enum Networks {
  Ethereum = "ethereum",
  Goerli = "goerli",
  Localhost = "localhost",
  Mumbai = "Mumbai",
}

export type AllowedNetworks =
  | Networks.Ethereum
  | Networks.Goerli
  | Networks.Localhost
  | Networks.Mumbai;

export class WalletService {
  public static ProviderEndpoints = {
    [Networks.Ethereum]:
      "https://eth-mainnet.alchemyapi.io/v2/EuGnkVlzVoEkzdg0lpCarhm8YHOxWVxE",
    [Networks.Goerli]:
      "https://goerli.infura.io/v3/96dffb3d8c084dec952c61bd6230af34",
    [Networks.Localhost]: "http://127.0.0.1:8545",
    [Networks.Mumbai]: "https://rpc-mumbai.maticvigil.com/v1/96bf5fa6e03d272fbd09de48d03927b95633726c",
  };
  public static RPCEndpoints = {
    1: WalletService.ProviderEndpoints[Networks.Ethereum],
    5: WalletService.ProviderEndpoints[Networks.Goerli],
    31337: WalletService.ProviderEndpoints[Networks.Localhost],
    80001: WalletService.ProviderEndpoints[Networks.Mumbai],
  };
  public static chainIdByName = new Map<AllowedNetworks, number>([
    [Networks.Ethereum, 1],
    [Networks.Goerli, 5],
    [Networks.Localhost, 31337],
  ]);
  public static targetedNetwork = Networks.Localhost;

  public provider: any;
  public readOnlyProvider: ethers.providers.BaseProvider;
  public defaultAccount: any;
  public defaultAccountAddress: Address;
  public defaultAccountDid: DID;
  public walletProvider: any;
  web3Modal: any;
  web3ModalProvider: any;

  public async connect() {
    this.provider = await this.getProvider();

    // this.defaultAccount = await this.getCurrentAccountFromProvider(
    //   this.provider
    // );
    // this.defaultAccountAddress = await this.getDefaultAccountAddress();

    if (!this.walletProvider) {
      this.ensureWeb3Modal();
      const web3ModalProvider = await this.web3Modal.connect();
      await this.setProvider(web3ModalProvider);
    }
  }

  private async getProvider() {
    let provider = null;

    this.readOnlyProvider = ethers.getDefaultProvider(
      WalletService.ProviderEndpoints[WalletService.targetedNetwork]
    );

    return this.readOnlyProvider;
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

  private async setProvider(web3ModalProvider: Web3Provider): Promise<void> {
    try {
      if (web3ModalProvider) {
        const walletProvider = new ethers.providers.Web3Provider(
          web3ModalProvider as any
        );
        (walletProvider as any).provider.autoRefreshOnNetworkChange = false; // mainly for metamask
        /**
         * we will keep the original readonly provider which should still be fine since
         * the targeted network cannot have changed.
         */
        this.walletProvider = walletProvider;
        this.web3ModalProvider = web3ModalProvider;
        this.defaultAccount = await this.getCurrentAccountFromProvider(
          this.walletProvider
        );
        this.defaultAccountAddress = await this.getDefaultAccountAddress();
        /* prettier-ignore */ console.log('>>>> _ >>>> ~ file: WalletService.ts ~ line 110 ~ this.defaultAccountAddress', this.defaultAccountAddress)
        this.defaultAccountDid = convertToDid(this.defaultAccountAddress, WalletService.chainIdByName[WalletService.targetedNetwork])
      }
    } catch (error) {
      console.log(
        `Error connecting to wallet provider ${error?.message}`,
        "error"
      );
    }
  }

  private ensureWeb3Modal(): void {
    if (!this.web3Modal) {
      this.web3Modal = new Web3Modal({
        // network: Networks.Mainnet,
        cacheProvider: false,
        providerOptions: {},
        theme: "dark",
      });
      /**
       * If a provider has been cached before, and is still set, Web3Modal will use it even
       * if we have pass `cachedProvider: false` above. `cachedProvider: true` only controls
       * whether the provider should be cached, not whether it should be used.
       * So call clearCachedProvider() here to clear it, just in case it has ever been set.
       */
      this.web3Modal?.clearCachedProvider();
    }
  }

  private async getNetwork(provider: Web3Provider): Promise<Network> {
    let network = await provider.getNetwork();
    network = Object.assign({}, network);
    if (network.name === "homestead") {
      network.name = "mainnet";
    }
    return network;
  }

  private async getCurrentAccountFromProvider(
    provider: Web3Provider
  ): Promise<Signer | string> {
    let account: Signer | string;
    if (Signer.isSigner(provider)) {
      account = provider;
    } else {
      const accounts = await provider.listAccounts();

      if (accounts) {
        account = getAddress(accounts[0]);
      } else {
        account = null;
      }
    }
    return account;
  }

  /**
   * address, even if signer
   */
  private async getDefaultAccountAddress(): Promise<Address | undefined> {
    if (Signer.isSigner(this.defaultAccount)) {
      return await this.defaultAccount.getAddress();
    } else {
      return getAddress(this.defaultAccount);
    }
  }
}
