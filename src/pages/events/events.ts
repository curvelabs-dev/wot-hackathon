import { autoinject, computedFrom } from "aurelia-framework";
import { Subscription } from "aurelia-event-aggregator";
import { useDidToAddress } from "modules/did";
import { TrustSigilContractService } from "services/contracts/TrustSigilContractService";
import { ContractsService } from "services/ContractsService";
import { OrbisService } from "services/OrbisService";
import { WalletService } from "services/WalletService";
import { ORBIS_GROUP_MEMBERS } from "shared/fixtures";
import "./events.scss";

@autoinject
export class Events {
  isCreateEvent = false;

  private newEventName: string;
  private newEventDescription: string;
  private newEventTime: string;
  private newEventUrl: string;
  private newEventAttendees: string;
  private numberOfTrustees = 0;
  private joinEventThreshold = 3;
  private subscriptions: Subscription[] = [];

  @computedFrom("numberOfTrustees", "joinEventThreshold")
  private get disableJoinButton() {
    const disable = this.numberOfTrustees !== this.joinEventThreshold;
    return disable;
  }

  constructor(
    private walletService: WalletService,
    private orbisService: OrbisService,
    private contractsService: ContractsService,
    private trustSigilContractService: TrustSigilContractService
  ) {}

  attached() {
    window.setTimeout(async () => {
      this.numberOfTrustees = await this.getNumberOfTrustees();
      this.subscriptions.push(
        this.trustSigilContractService.subscribeSigilMintedEvent(
          async (sigilMintedEvent) => {
            const wasAdded =
              this.trustSigilContractService.maybeAddNewSigilMintEvent(
                sigilMintedEvent
              );
            if (!wasAdded) return;
            this.numberOfTrustees = await this.getNumberOfTrustees();
          }
        )
      );
    }, 500);
  }

  detached() {
    this.subscriptions.forEach((sub) => sub.dispose());
  }

  private async enableCreateEvent() {
    this.isCreateEvent = true;
  }

  private cancelCreateEvent() {
    this.isCreateEvent = false;
  }

  private async createEvent() {
    //
  }

  private async getNumberOfTrustees() {
    // 1. List of Group members
    const groupMembers = this.orbisService.groupMembers;
    // const groupMembers = ORBIS_GROUP_MEMBERS;
    /* prettier-ignore */ console.log('>>>> _ >>>> ~ file: events.ts ~ line 38 ~ groupMembers', groupMembers)

    // 2. All the sigils from Contract Event
    const events = await this.trustSigilContractService.getEvents();
    // const events = EVENTS;
    /* prettier-ignore */ console.log('>>>> _ >>>> ~ file: events.ts ~ line 42 ~ events', events)

    const connectedMemberAddress = this.walletService.defaultAccountAddress;

    // 1. Get Group members

    // 2. All the sigils from Contract Event
    const connectedIsSenderEvents: {
      args: Partial<typeof events[number]["args"]>;
    }[] = [];
    events.forEach((event) => {
      const same =
        event.args[0].toLowerCase() === connectedMemberAddress.toLowerCase();

      if (!same) return;
      connectedIsSenderEvents.push({ args: event.args });
    });
    // connectedIsSenderEvents; /*?*/

    // 3. Get trustees in group
    const followerIsInGroupCollector = [];
    groupMembers.forEach((member) => {
      const address = useDidToAddress(member.profile_details.did);
      // address; /*?*/
      const target = connectedIsSenderEvents.find(
        (event) => event.args[1].toLowerCase() === address.toLowerCase()
      );
      if (!target) return;
      followerIsInGroupCollector.push(target);
    });

    const numberOfTrustees = followerIsInGroupCollector.length;
    return numberOfTrustees;
  }
}

const GROUP_MEMBERS = ORBIS_GROUP_MEMBERS;
const EVENTS = [
  {
    blockNumber: 4,
    blockHash:
      "0x2c5618dea73af203b59c47b21f112623649c2433b8005cf40ebeecc09c93411c",
    transactionIndex: 0,
    removed: false,
    address: "0x5FbDB2315678afecb367f032d93F642f64180aa3",
    data: "0x000000000000000000000000f39fd6e51aad88f6f4ce6ab8827279cfffb92266000000000000000000000000bf3a5599f2f6ce89862d640a248e31f30b7ddf2900000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000004",
    topics: [
      "0x17e33c6091864f011eee801c2270fb98fd9961c364dbf65a515007fe156dcb2a",
    ],
    transactionHash:
      "0x1704fb3f2cc913a333979321062f865c7da73ea70139d25dabf34d1d0e0c9157",
    logIndex: 1,
    event: "SigilMinted",
    eventSignature: "SigilMinted(address,address,uint256,uint256)",
    args: [
      "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
      "0xBf3a5599f2f6CE89862d640a248e31F30B7ddF29",
      {
        _hex: "0x01",
        _isBigNumber: true,
      },
      {
        _hex: "0x04",
        _isBigNumber: true,
      },
    ],
  },
];
