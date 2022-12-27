import { autoinject, bindable, computedFrom } from "aurelia-framework";
import { activationStrategy } from "aurelia-router";
import { BigNumber } from "ethers/lib/ethers";
import { useDidToAddress } from "modules/did";
import { ContractNames } from "services/ContractsDeploymentProvider";
import { ContractsService } from "services/ContractsService";
import { LitActionsService } from "services/LitActionsService";
import { OrbisService } from "services/OrbisService";
import { WalletService } from "services/WalletService";
import { TOKEN_ID } from "shared/constants";
import { DID } from "types";

import "./profile.scss";

@autoinject
export class Profile {
  @bindable did: DID;

  didChanged(newValue) {
    this.resetVars();
    this.attached();

    this.did = newValue;
  }

  private isFollowing: boolean;
  private isTrusting: boolean;
  private hasSigil = false;
  private sigils: BigNumber;

  @computedFrom("did", "orbisService.connectedUser.did")
  get isSameUser() {
    const isSame =
      this.orbisService.connectedUser?.did.toLowerCase() ===
      this.did.toLowerCase();
    return isSame;
  }

  constructor(
    private orbisService: OrbisService,
    private litActionsService: LitActionsService,
    private contractsService: ContractsService,
    private walletService: WalletService
  ) {}

  // async activate(params: { did: DID }): Promise<void> {
  //   this.did = params.did;
  // }

  async attached() {
    // Hack to wait for app.ts#attached to finish
    window.setTimeout(async () => {
      // this.isFollowing = await this.orbisService.isFollowing(
      //   // this.isFollowing = await this.orbisService.rawIsFollowing(
      //   this.orbisService.connectedUser.did,
      //   this.did
      // );
      this.isFollowing = true;
      /* prettier-ignore */ console.log('>>>> _ >>>> ~ file: profile.ts ~ line 26 ~ this.isFollowing', this.isFollowing)

      const getTrustSigilContract =
        await this.contractsService.getTrustSigilContract();
      this.sigils = await getTrustSigilContract.getSigil(
        TOKEN_ID,
        useDidToAddress(this.did),
        this.walletService.defaultAccountAddress
      );
      /* prettier-ignore */ console.log('>>>> _ >>>> ~ file: profile.ts ~ line 57 ~ this.sigils', this.sigils)
      this.hasSigil = this.checkHasSigils();
    }, 500);
  }

  private checkHasSigils() {
    if (!this.sigils) return false;

    const hasSigil = this.sigils.toNumber() !== 0;
    return hasSigil;
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

    const TrustSigilContract =
      await this.contractsService.getTrustSigilContract();
    /* prettier-ignore */ console.log('>>>> _ >>>> ~ file: app.ts ~ line 68 ~ contract', TrustSigilContract)
    const receipientAddress = useDidToAddress(this.did);
    const txResponse = await TrustSigilContract.mintSigil(
      receipientAddress,
      TOKEN_ID,
      response.signatures
    );

    this.hasSigil = !!txResponse;
    /* prettier-ignore */ console.log('>>>> _ >>>> ~ file: profile.ts ~ line 80 ~ txResponse', txResponse)
  }

  private resetVars() {
    this.isFollowing = false;
    this.isTrusting = false;
    this.hasSigil = false;
    this.sigils = undefined;
  }
}
