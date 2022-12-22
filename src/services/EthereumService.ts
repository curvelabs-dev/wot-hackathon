import { WalletService } from "./WalletService";

export class EthereumService {
  private blockSubscribed = false;

  constructor(private walletService: WalletService) {}

  public async listenToEvent(eventName: string) {
    if (!this.blockSubscribed) {
      this.walletService.readOnlyProvider.on("block", () => {
        this.handleNewBlock();
      });
      this.blockSubscribed = true;
    }
  }

  handleNewBlock() {
    /* prettier-ignore */ console.log('>>>> _ >>>> ~ file: EthereumService.ts ~ line 18 ~ handleNewBlock')
    // throw new Error("Method not implemented.");
  }
}
