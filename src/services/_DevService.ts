import { autoinject, singleton } from "aurelia-framework";
import { TOKEN_ID } from "shared/constants";
import { ALL_USERS_ADDRESSES } from "shared/fixtures";
import { ContractsService } from "./ContractsService";
import { OrbisService } from "./OrbisService";

@autoinject
@singleton()
export class _DevService {
  public runConnected = false;
  public isProduction = false;

  public OrbisService: OrbisService;
  public get isOrbisActive() {
    const is = this.OrbisService.orbis && this.OrbisService.initiated;
    return is;
  }

  constructor(private contractsService: ContractsService) {}

  public async setupSigils(): Promise<void> {
    const TrustSigilContract =
      await this.contractsService.getTrustSigilContract();

    for (const address of ALL_USERS_ADDRESSES) {
      await TrustSigilContract.mintSigil(address, TOKEN_ID, []);
    }
  }
}
