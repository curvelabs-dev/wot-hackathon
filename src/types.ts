declare global {
  interface Window {
    ethereum: any;
  }
}

export type DID = string;
export type Address = string;

export interface OrbisUser {
  did: DID;
  metadata: {
    chain: string;
    address: Address;
    ensName: string;
  }
}

export {}
