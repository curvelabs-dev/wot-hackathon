import { autoinject } from "aurelia-framework";
import { Address } from "types";

const contractBasePath = "../contracts";

/** Ganache -> Network Id */
const networkId = "5777";

export enum ContractNames {
  BadgerCore = "BadgerCore",
  TrustSigil = "TrustSigil",
  OrbisBridge = "OrbisBridge",
}

export enum ContractAddresses {
  BadgerCore = "BadgerCore",
  TrustSigil = "0x5fbdb2315678afecb367f032d93f642f64180aa3",
  OrbisBridge = "0xe7f1725e7734ce288f8367e1bb143e90bb3f0512",
}

const ContractPaths = {
  BadgerCore: `../contracts/BadgerCore.sol/BadgerCore.json`,
  TrustSigil: `${contractBasePath}/TrustSigil.sol/TrustSigil.json`,
  OrbisBridge: `${contractBasePath}/attestors/OrbisBridge.sol/OrbisBridge.json`,
};

interface IContractInfo {
  contractName: string;
  abi: Array<any>;
}

interface IContractInfosJson {
  [contractName: string]: {
    contractName: string;
    abi: Array<any>;
  };
}

interface ISharedContractInfos {
  [name: string]: Array<any>;
}

@autoinject
export class ContractsDeploymentProvider {
  private static contractInfosJson: IContractInfosJson = {};
  // private static sharedContractAbisJson: ISharedContractInfos;

  public static async initAll() {
    for (const contractName of Object.keys(ContractNames)) {
      await this.initialize(contractName as ContractNames);
    }

    ContractsDeploymentProvider.contractInfosJson;
  }

  public static async initialize(contractName: ContractNames): Promise<void> {
    if (contractName === ContractNames.OrbisBridge) {
      ContractsDeploymentProvider.contractInfosJson[contractName] =
        (await import(
          `../contracts/attestors/${contractName}.sol/${contractName}.json`
        )) as IContractInfo;
      return;
    }
    ContractsDeploymentProvider.contractInfosJson[contractName] = (await import(
      `../contracts/${contractName}.sol/${contractName}.json`
    )) as IContractInfo;

    // if (!ContractsDeploymentProvider.sharedContractAbisJson) {
    //   ContractsDeploymentProvider.sharedContractAbisJson = require("../../build/contracts/sharedAbis.json") as ISharedContractInfos;
    // }
  }

  public static getContractAbi(contractName: string): Array<any> {
    let abi = ContractsDeploymentProvider.contractInfosJson[contractName].abi;
    if (typeof abi === "string") {
      // is name of shared abi, such as ERC20
      abi = ContractsDeploymentProvider.contractInfosJson[contractName][abi];
    } else if (!abi) {
      abi =
        ContractsDeploymentProvider.contractInfosJson[contractName][
          contractName
        ];
    }
    return abi;
  }

  public static getContractAddress(contractName?: ContractNames): Address {
    const address = ContractAddresses[contractName]
    return address;
    // return ContractsDeploymentProvider.contractInfosJson.networks[networkId].address;
    // return ContractsDeploymentProvider.contractInfosJson.contracts[contractName]?.address;
  }
}
