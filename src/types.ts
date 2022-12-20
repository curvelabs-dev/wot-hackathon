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
  signatures: unknown;
  decryptions: unknown;
  response: string;
  logs: string,
}

export {};
