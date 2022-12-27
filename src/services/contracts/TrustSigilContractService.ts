import { autoinject, singleton } from "aurelia-framework";
import { EventAggregator } from "aurelia-event-aggregator";
import { ContractsService } from "services/ContractsService";
import { SigilMintedEvent } from "contracts/types/contracts/TrustSigil";

const SigilMintedEvent = "SigilMintedEvent";

@autoinject
@singleton(false)
export class TrustSigilContractService {
  private events: SigilMintedEvent[];

  constructor(
    private contractsService: ContractsService,
    private eventAggregator: EventAggregator
  ) {}

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

  public async listenToSigilMintedEvent(): Promise<void> {
    const TrustSigilContract =
      await this.contractsService.getTrustSigilContract();

    const SigilMinted = TrustSigilContract.filters.SigilMinted();
    TrustSigilContract.on(SigilMinted, (...args) => {
      /* prettier-ignore */ console.log('>>>> _ >>>> ~ file: TrustSigilContractService.ts ~ line 46 ~ args', args)
      const txResponse = args[args.length - 1] as SigilMintedEvent;
      this.publishSigilMintedEvent(txResponse);
    });
  }

  public publishSigilMintedEvent(sigilMintedEvent: SigilMintedEvent) {
    this.eventAggregator.publish(SigilMintedEvent, sigilMintedEvent);
  }

  public subscribeSigilMintedEvent(
    callback: (sigilMintedEvent: SigilMintedEvent) => void
  ) {
    return this.eventAggregator.subscribe(SigilMintedEvent, callback);
  }

  public maybeAddNewSigilMintEvent(
    sigilMintedEvent: SigilMintedEvent
  ): boolean {
    const alreadyPresent = this.events.find((event) => {
      const same = event.blockNumber === sigilMintedEvent.blockNumber;
      return same;
    });

    if (!alreadyPresent) {
      this.events.push(sigilMintedEvent as unknown as SigilMintedEvent);
    }

    const wasAdded = !alreadyPresent;
    return wasAdded;
  }

  private async hydrateEvents() {
    this.events = await this.contractsService.getAllEventsFromTrustSigil();
  }
}
