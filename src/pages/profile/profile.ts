import { DID } from "types";

export class Profile {
  did: DID;

  async activate(params: { did: DID }): Promise<void> {
    this.did = params.did;
    /* prettier-ignore */ console.log('>>>> _ >>>> ~ file: profile.ts ~ line 8 ~ this.did', this.did)
  }
}
