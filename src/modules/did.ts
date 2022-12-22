import { getAddressFromDid } from "@orbisclub/orbis-sdk/utils";
import { Address, DID } from "types";

/** Turns a did:pkh into a clean address and chain object */
export default function useDidToAddress(did: string) {
  if (did.includes("did:pkh")) {
    const res = getAddressFromDid(did);
    return res.address;
  }

  return did;
}

export function convertToDid(address: Address): DID {
  const didPrefix = "did:pkh:eip155:1:";
  const converted = `${didPrefix}${address}`;
  return converted;
}
