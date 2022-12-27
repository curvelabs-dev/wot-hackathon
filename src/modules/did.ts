// import { getAddressFromDid } from "@orbisclub/orbis-sdk/utils";
import { Networks, WalletService } from "services/WalletService";
import { Address, DID } from "types";

/** Turns a did:pkh into a clean address and chain object */
export function useDidToAddress(did: string) {
  if (did.includes("did:pkh")) {
    // const res = getAddressFromDid(did);
    const res = { address: did.split(":")[4] };
    return res.address;
  }

  return did;
}

export function convertToDid(
  address: Address,
  chainId = 5
  // chainId: number = WalletService.chainIdByName[Networks.Goerli]
): DID {
  const didPrefix = `did:pkh:eip155:${chainId}:`;
  const converted = `${didPrefix}${address}`;
  return converted;
}
