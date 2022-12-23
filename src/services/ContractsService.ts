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
import { Address } from "types";
import { TrustSigil } from "contracts/types";

@autoinject
export class ContractsService {
  private static Contracts = new Map<ContractNames, Contract>([
    [ContractNames.BadgerCore, null],
    [ContractNames.OrbisBridge, null],
    [ContractNames.TrustSigil, null],
  ]);

  private initializingContracts: Promise<void>;
  private initializingContractsResolver: () => void;

  constructor(
    private eventAggregator: EventAggregator,
    private walletService: WalletService
  ) {
    ContractsService.Contracts.delete(ContractNames.BadgerCore);
  }

  public async listenToEvents(): Promise<void> {
    const TrustSigilContract = await this.getTrustSigilContract();

    const SigilMinted = TrustSigilContract.filters.SigilMinted();
    TrustSigilContract.on(SigilMinted, this.handleSigilMinted);
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

  private async assertContracts(): Promise<void> {
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

    this.resolveInitializingContracts();
  }

  public async getContractFor(
    contractName: ContractNames
  ): Promise<Contract & any> {
    await this.assertContracts();
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

  private handleSigilMinted(...args) {
    /* prettier-ignore */ console.log('>>>> _ >>>> ~ file: ContractsService.ts ~ line 147 ~ args', args)
  }
}