import "./sigils.scss";

export class Sigils {
  isCreateEvent = false;

  private newEventName: string;
  private newEventDescription: string;
  private newEventTime: string;
  private newEventUrl: string;
  private newEventAttendees: string;

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
