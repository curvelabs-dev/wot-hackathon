import { BigNumber, Contract, ethers, Signer } from "ethers";
import { EventAggregator } from "aurelia-event-aggregator";
import { autoinject } from "aurelia-framework";
import {
  ContractNames,
  ContractsDeploymentProvider,
} from "services/ContractsDeploymentProvider";
import { BaseProvider, JsonRpcProvider } from "@ethersproject/providers";
import { WalletService } from "./WalletService";
import { isLocalhostNetwork } from "modules/networks";
import { Address, IStandardEvent } from "types";
import { TrustSigil } from "contracts/types";
import { EthereumService } from "./EthereumService";
import { SigilMintedEvent } from "contracts/types/contracts/TrustSigil";
import { Utils } from "shared/utils";

@autoinject
export class ContractsService {
  private initializing = true;
  private initializedPromise: Promise<unknown>;

  private static Contracts = new Map<ContractNames, Contract>([
    [ContractNames.BadgerCore, null],
    [ContractNames.OrbisBridge, null],
    [ContractNames.TrustSigil, null],
  ]);

  private initializingContracts: Promise<void>;
  private initializingContractsResolver: () => void;
  events: SigilMintedEvent[];

  constructor(
    private eventAggregator: EventAggregator,
    private ethereumService: EthereumService,
    private walletService: WalletService
  ) {
    this.initializedPromise = Utils.waitUntilTrue(
      () => !this.initializing,
      9999999999
    );
    ContractsService.Contracts.delete(ContractNames.BadgerCore);
  }

  public async ensureLoaded() {
    return this.initializedPromise;
  }

  public unsubscribeEvents(): void {
    // todo
  }

  private setInitializingContracts(): void {
    if (!this.initializingContractsResolver) {
      /**
       * jump through this hook because the order of receipt of `EthereumService.onConnect`
       * is indeterminant, but we have to make sure `ContractsService.initializeContracts`
       * has completed before someone tries to use `this.Contracts` (see `getContractFor`).
       */
      this.initializingContracts = new Promise<void>((resolve: () => void) => {
        this.initializingContractsResolver = resolve;
      });
    }
  }

  private resolveInitializingContracts(): void {
    this.initializingContractsResolver();
    this.initializingContractsResolver = null;
  }

  public async assertContracts(): Promise<void> {
    return this.initializingContracts;
  }

  public createProvider(): any {
    let signerOrProvider: BaseProvider | JsonRpcProvider | ethers.Signer;

    if (isLocalhostNetwork()) {
      const jsonSigner: JsonRpcProvider = this.walletService
        .readOnlyProvider as JsonRpcProvider;
      signerOrProvider = jsonSigner.getSigner(
        this.walletService.defaultAccountAddress ?? undefined
      );
    } else {
      signerOrProvider = this.walletService.readOnlyProvider;
    }
    return signerOrProvider;
  }

  public initializeContracts(): void {
    /**
     * to assert that contracts are not available during the course of this method
     */
    if (!this.initializingContractsResolver) {
      this.setInitializingContracts();
    }

    const reuseContracts = ContractsService.Contracts.get(
      // at least one arbitrary contract already exists
      ContractNames.BadgerCore
    );

    const signerOrProvider = this.createProvider();

    ContractsService.Contracts.forEach((_contract, contractName) => {
      let contract;

      if (reuseContracts) {
        contract =
          ContractsService.Contracts.get(contractName).connect(
            signerOrProvider
          );
      } else {
        try {
          contract = new ethers.Contract(
            ContractsService.getContractAddress(contractName),
            ContractsService.getContractAbi(contractName),
            signerOrProvider
          );
        } catch (error) {
          throw new Error(`No Abi for Contract "${contractName}" found.`);
        }
      }
      ContractsService.Contracts.set(contractName, contract);
    });

    this.eventAggregator.publish("Contracts.Changed");

    this.initializing = false;
    this.resolveInitializingContracts();
  }

  public async getContractFor(
    contractName: ContractNames
  ): Promise<Contract & any> {
    await this.assertContracts();
    await this.ensureLoaded();
    return ContractsService.Contracts.get(contractName);
  }

  public static getContractAbi(contractName: ContractNames): Array<any> {
    return ContractsDeploymentProvider.getContractAbi(contractName);
  }

  public static getContractAddress(contractName: ContractNames): Address {
    return ContractsDeploymentProvider.getContractAddress(contractName);
  }

  public getContractAtAddress(
    contractName: ContractNames,
    address: Address
  ): Contract & any {
    return new ethers.Contract(
      address,
      ContractsService.getContractAbi(contractName),
      this.createProvider()
    );
  }

  public async getTrustSigilContract() {
    const TrustSigilContract = await this.getContractFor(
      ContractNames.TrustSigil
    );
    return TrustSigilContract as TrustSigil;
  }

  /**
   * fetch Events in small blocks to avoid "block range is too wide" error from the provider
   */
  public async filterEventsInBlocks<TEventArgs>(
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
    contract: any,
    filter: unknown,
    startingBlockNumber: number,
    handler: (event: Array<TEventArgs>) => void
  ): Promise<void> {
    const lastBlock = await this.ethereumService.getLastBlock();
    if (lastBlock === null) {
      console.log("Could not filter events", "No Blocks found");
      return;
    }

    const lastEthBlockNumber = lastBlock.number;
    const blocksToFetch = lastEthBlockNumber - startingBlockNumber;
    let startingBlock = startingBlockNumber;

    /**
     * fetch in small blocks to avoid "block range is too wide" error from the provider
     */
    const blocksize = blocksToFetch;
    let fetched = 0;

    do {
      const endBlock = startingBlock + blocksize + 1;
      await contract
        .queryFilter(filter, startingBlock, endBlock)
        .then((events: Array<TEventArgs>): void => {
          if (events?.length) {
            handler(events);
          }
        });
      fetched += blocksize;
      startingBlock += blocksize;
    } while (fetched < blocksToFetch);
  }
}
