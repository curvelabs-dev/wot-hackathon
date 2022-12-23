import { autoinject, bindable } from "aurelia-framework";
import { Router } from "aurelia-router";
import { Address, DID } from "types";
import makeBlockie from "ethereum-blockies-base64";
import useDidToAddress from "modules/did";
import { USER_FIRST } from "shared/fixtures";

import "./wot-user.scss"

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
