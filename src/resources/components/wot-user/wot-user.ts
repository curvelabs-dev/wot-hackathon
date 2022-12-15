import { bindable } from "aurelia-framework";
import { USER_FIRST } from "shared/constants";
import { Address } from "types";
import makeBlockie from "ethereum-blockies-base64";

export class WotUser {
  @bindable pfp: string;
  @bindable address: Address = USER_FIRST.address;

  private finalPfp: string;
  private shortenedAddress: string;

  attached() {
    this.finalPfp = this.pfp ?? makeBlockie(useDidToAddress(this.address));

    const addressLength = this.address.length;
    this.shortenedAddress = `${this.address.slice(0, 4)}...${this.address.slice(
      addressLength - 4,
      addressLength
    )}`;
  }
}

import { getAddressFromDid } from "@orbisclub/orbis-sdk/utils";

/** Turns a did:pkh into a clean address and chain object */
export default function useDidToAddress(did: string) {
  if (did.includes("did:pkh")) {
    const res = getAddressFromDid(did);
    return res;
  }

  return did;
}
