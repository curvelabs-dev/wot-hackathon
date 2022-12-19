import { autoinject, bindable } from "aurelia-framework";
import { Router } from "aurelia-router";
import { USER_FIRST } from "shared/constants";
import { Address, DID } from "types";
import makeBlockie from "ethereum-blockies-base64";

@autoinject
export class WotUser {
  @bindable pfp: string;
  @bindable did: DID = USER_FIRST.did;
  @bindable address: Address;

  private finalPfp: string;
  private shortenedAddress: string;

  constructor(private router: Router) {}

  attached() {
    if (!this.address) {
      this.address = useDidToAddress(this.did);
    }

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
    return res.address;
  }

  return did;
}
