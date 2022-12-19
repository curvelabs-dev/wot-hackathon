import { autoinject, computedFrom } from "aurelia-framework";
import { activationStrategy } from "aurelia-router";
import { OrbisService } from "services/OrbisService";
import { DID } from "types";

@autoinject
export class Profile {
  did: DID;
  private isFollowing: boolean;

  @computedFrom("did", "orbisService.connectedUser.did")
  get isSameUser() {
    const isSame = this.orbisService.connectedUser.did === this.did;
    return isSame;
  }

  constructor(private orbisService: OrbisService) {}

  async activate(params: { did: DID }): Promise<void> {
    this.did = params.did;

    this.isFollowing = await this.orbisService.isFollowing(
      this.orbisService.connectedUser.did,
      this.did
    );
    /* prettier-ignore */ console.log('>>>> _ >>>> ~ file: profile.ts ~ line 26 ~ this.isFollowing', this.isFollowing)
  }

  private determineActivationStrategy() {
    return activationStrategy.replace;
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
