import { autoinject, computedFrom } from "aurelia-framework";
import { activationStrategy } from "aurelia-router";
import useDidToAddress from "modules/did";
import { ContractNames } from "services/ContractsDeploymentProvider";
import { ContractsService } from "services/ContractsService";
import { LitActionsService } from "services/LitActionsService";
import { OrbisService } from "services/OrbisService";
import { TOKEN_ID } from "shared/constants";
import { DID } from "types";

@autoinject
export class Profile {
  did: DID;
  private isFollowing: boolean;
  private isTrusting: boolean;

  @computedFrom("did", "orbisService.connectedUser.did")
  get isSameUser() {
    const isSame = this.orbisService.connectedUser.did === this.did;
    return isSame;
  }

  constructor(
    private orbisService: OrbisService,
    private litActionsService: LitActionsService,
    private contractsService: ContractsService
  ) {}

  async activate(params: { did: DID }): Promise<void> {
    this.did = params.did;

    this.isFollowing = await this.orbisService.isFollowing(
      // this.isFollowing = await this.orbisService.rawIsFollowing(
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

    if (this.isFollowing) {
      this.unfollow();
      return;
    }

    this.follow();
  }

  private follow() {
    // Lit Actions

    // sigil

    // orbis follow
    this.orbisService.followUser(this.did);
  }

  private unfollow() {
    this.orbisService.followUser(this.did);
  }

  private async trust() {
    const response = await this.litActionsService.isFollowing_rawOrbisApi(
      this.orbisService.connectedUser.did,
      this.did
    );

    this.isTrusting = response.isFollowing;

    const TrustSigilContract = await this.contractsService.getContractFor(
      ContractNames.TrustSigil
    );
    /* prettier-ignore */ console.log('>>>> _ >>>> ~ file: app.ts ~ line 68 ~ contract', TrustSigilContract)
    const receipientAddress = useDidToAddress(this.did);
    const txResponse = await TrustSigilContract.mintSigil(
      receipientAddress,
      TOKEN_ID,
      response.signatures
    );
    /* prettier-ignore */ console.log('>>>> _ >>>> ~ file: profile.ts ~ line 80 ~ txResponse', txResponse)
  }
}
