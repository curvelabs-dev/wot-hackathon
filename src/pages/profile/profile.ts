import { autoinject, bindable, computedFrom } from "aurelia-framework";
import { activationStrategy } from "aurelia-router";
import { BigNumber } from "ethers/lib/ethers";
import { useDidToAddress } from "modules/did";
import { TrustSigilContractService } from "services/contracts/TrustSigilContractService";
import { ContractsService } from "services/ContractsService";
import { LitActionsService } from "services/LitActionsService";
import { OrbisService } from "services/OrbisService";
import { WalletService } from "services/WalletService";
import { _DevService } from "services/_DevService";
import { TOKEN_ID } from "shared/constants";
import { DID } from "types";

import "./profile.scss";

@autoinject
export class Profile {
  @bindable did: DID;

  didChanged(newValue: string) {
    // if (newValue.toLowerCase() === this.did.toLowerCase()) return
    this.did = newValue;
    this.resetVars();
    this.attached();
  }

  private isFollowing: boolean;
  private isTrusting: boolean;
  /**
   * Could also just use `isTrusting`, but I'm leaving it for now for flexibility (has risks of bugs though)
   */
  private hasSigil = false;
  private sigil: BigNumber;

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
    private trustSigilContractService: TrustSigilContractService,
    private walletService: WalletService,
    private _DevService: _DevService
  ) {}

  // async activate(params: { did: DID }): Promise<void> {
  //   this.did = params.did;
  // }

  async attached() {
    await this.orbisService.ensureLoaded();
    await this.contractsService.ensureLoaded();
    await this.trustSigilContractService.ensureLoaded();

    // Hack to wait for app.ts#attached to finish
    this.isFollowing = await this.orbisService.isFollowing(
      // this.isFollowing = await this.orbisService.rawIsFollowing(
      this.orbisService.connectedUser.did,
      this.did
    );
    // this.isFollowing = true;
    // /* prettier-ignore */ console.log('>>>> _ >>>> ~ file: profile.ts ~ line 26 ~ this.isFollowing', this.isFollowing)

    const getTrustSigilContract =
      await this.contractsService.getTrustSigilContract();
    this.sigil = await getTrustSigilContract.getSigil(
      TOKEN_ID,
      useDidToAddress(this.did),
      this.walletService.defaultAccountAddress
    );
    /* prettier-ignore */ console.log('>>>> _ >>>> ~ file: profile.ts ~ line 57 ~ this.sigils', this.sigil)
    this.hasSigil = this.checkHasSigils();
    this.isTrusting = this.hasSigil;
  }

  private checkHasSigils() {
    if (!this.sigil) return false;

    const hasSigil = this.sigil.toNumber() !== 0;
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

  private async follow() {
    // const response = await this.orbisService.followUser(this.did);
    // console.log('Follow Response: ', response)
    this.isFollowing = true;
  }

  private async unfollow() {
    // const response = await this.orbisService.unfollowUser(this.did);
    // console.log('Unfollow Response: ', response)

    this.isFollowing = false
  }

  private async trust() {
    const response = await this.litActionsService.isFollowing_rawOrbisApi(
      this.orbisService.connectedUser.did,
      this.did
    );

    this.isTrusting = response.isFollowing;

    const TrustSigilContract =
      await this.contractsService.getTrustSigilContract();
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
    this.sigil = undefined;
  }
}
