import { autoinject } from "aurelia-framework";
import { IBlockInfo } from "types";
import { WalletService } from "./WalletService";

@autoinject
export class EthereumService {
  private blockSubscribed = false;

  constructor(private walletService: WalletService) {}

  public async getLastBlock() {
    const blockNumber =
      await this.walletService.readOnlyProvider.getBlockNumber();
    /**
     * -1 to be safer on arbitrum cuz sometimes is not valid, perhaps because of block reorganization,
     * (but I'm not sure this entirely suffices)
     */
    return this.getBlock(blockNumber - 1);
  }

  public async getBlock(blockNumber: number): Promise<IBlockInfo> {
    try {
      const block = (await this.walletService.readOnlyProvider.getBlock(
        blockNumber
      )) as unknown as IBlockInfo;
      return block;
    } catch (e) {
      console.log("BLOCK GET ERR", e);
      return null;
    }
  }

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
