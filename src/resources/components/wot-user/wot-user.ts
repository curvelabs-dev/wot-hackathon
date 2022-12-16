import { autoinject, bindable } from "aurelia-framework";
import { Router } from "aurelia-router";
import { USER_FIRST } from "shared/constants";
import { Address, DID } from "types";
import makeBlockie from "ethereum-blockies-base64";

@autoinject
export class WotUser {
  @bindable pfp: string;
  @bindable address: Address = USER_FIRST.address;
  @bindable did: DID = USER_FIRST.did;

  private finalPfp: string;
  private finalAddress: string;
  private shortenedAddress: string;

  constructor(private router: Router) {}

  attached() {
    this.finalAddress = useDidToAddress(this.address);
    this.finalPfp = this.pfp ?? makeBlockie(useDidToAddress(this.address));

    const addressLength = this.finalAddress.length;
    this.shortenedAddress = `${this.finalAddress.slice(
      0,
      4
    )}...${this.finalAddress.slice(addressLength - 4, addressLength)}`;
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
