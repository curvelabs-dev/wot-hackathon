import { BigNumber } from "ethers/lib/ethers";

declare global {
  interface Window {
    ethereum: any;
  }
}

export type DID = string;
export type Address = string;
export type Hash = string;

export interface OrbisUser {
  did: DID;
  metadata: {
    chain: string;
    address: Address;
    ensName: string;
  };
}

export interface GroupMemberStream {
  stream_id: string;
  did: DID;
  group_id: string;
  content: {
    active: true;
    group_id: string;
  };
  active: "true";
  created_at: string;
  timestamp: 1671140917;
  profile_details: {
    did: DID;
    profile: OrbisUser;
  };
}

export interface ILitActionSignatureResponse {
  signatures: {
    sig1: {
      signature: string;
    };
  };
  decryptions: unknown;
  response: string;
  logs: string;
}

export interface IBlockInfoNative {
  hash: Hash;
  /**
   * previous block
   */
  parentHash: Hash;
  /**
   *The height(number) of this
   */
  number: number;
  timestamp: number;
  /**
   * The maximum amount of gas that this block was permitted to use. This is a value that can be voted up or voted down by miners and is used to automatically adjust the bandwidth requirements of the network.
   */
  gasLimit: BigNumber;
  /**
   * The total amount of gas used by all transactions in this
   */
  gasUsed: BigNumber;
  transactions: Array<Hash>;
}

export interface IBlockInfo extends IBlockInfoNative {
  blockDate: Date;
}

export interface IStandardEvent<TArgs> {
  args: TArgs;
  transactionHash: Hash;
  blockNumber: number;
  getBlock(): Promise<IBlockInfoNative>;
}

export {};
