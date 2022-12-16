import { autoinject, computedFrom } from "aurelia-framework";
import { OrbisService } from "services/OrbisService";
import { DID } from "types";

@autoinject
export class Profile {
  did: DID;

  @computedFrom("did", "orbisService.connectedUser.did")
  get isSameUser() {
    const isSame = this.orbisService.connectedUser.did === this.did;
    return isSame;
  }

  constructor(private orbisService: OrbisService) {}

  async activate(params: { did: DID }): Promise<void> {
    this.did = params.did;
  }

  private handleFollow() {
    if (this.isSameUser) return;

    if (
      this.orbisService.isFollowing(
        this.orbisService.connectedUser.did,
        this.did
      )
    ) {
      this.orbisService.unfollowUser(this.did);
      return;
    }

    this.orbisService.followUser(this.did);
  }
}
