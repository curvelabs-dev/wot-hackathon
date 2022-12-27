import { autoinject } from "aurelia-framework";
import { WalletService } from "services/WalletService";
import "./events.scss";

@autoinject
export class Events {
  isCreateEvent = false;

  private newEventName: string;
  private newEventDescription: string;
  private newEventTime: string;
  private newEventUrl: string;
  private newEventAttendees: string;

  constructor(private walletService: WalletService) {}

  private async enableCreateEvent() {
    this.isCreateEvent = true;
  }

  private cancelCreateEvent() {
    this.isCreateEvent = false;
  }

  private async createEvent() {
    //
  }
}
