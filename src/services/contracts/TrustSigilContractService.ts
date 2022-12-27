import { autoinject } from "aurelia-framework";
import { ContractsService } from "services/ContractsService";

@autoinject
export class TrustSigilContractService {
  private events;

  constructor(private contractsService: ContractsService) {}

  public async init() {
    await this.hydrateEvents();
  }

  public async getEvents() {
    if (!this.events) await this.hydrateEvents();

    return this.events;
  }

  // public isTrusting(did: string, sigil: BigNumber): boolean {
  //   if (!sigil) return false;
  // }

  private async hydrateEvents() {
    this.events = await this.contractsService.getAllEventsFromTrustSigil();
  }
}
