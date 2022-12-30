import { EventAggregator, Subscription } from "aurelia-event-aggregator";
import { autoinject, PLATFORM } from "aurelia-framework";
import { NavModel, Router, RouterConfiguration } from "aurelia-router";
import LitConnectModal from "lit-connect-modal";
import WalletConnectProvider from "@walletconnect/ethereum-provider";

import {
  ContractNames,
  ContractsDeploymentProvider,
} from "services/ContractsDeploymentProvider";
import {
  OrbisService,
  WOT_HACKATHON_ORBIS_GROUP_ID,
} from "services/OrbisService";
import { WalletService } from "services/WalletService";
import { _DevService } from "services/_DevService";
import { LitActionsService } from "services/LitActionsService";
import "./types";
import { myExpect } from "modules/expect";

import "./styles/globals.css";
import "./styles/utilities.css";
import "./styles/responsive.css";
import "./styles/Home.css";
import "./app.scss";
import { ContractsService } from "services/ContractsService";
import { UserChangedEvent } from "resources/components/wot-user/wot-user";
import { DID } from "./types";
import { TrustSigilContractService } from "services/contracts/TrustSigilContractService";

@autoinject
export class App {
  public message = "Hello World!";
  private connectionStatus: boolean;
  private selectedUserDid: DID;
  private subscriptions: Subscription[] = [];
  private navigationItem: NavModel;

  constructor(
    private orbisService: OrbisService,
    private litActionsService: LitActionsService,
    private contractsDeploymentProvider: ContractsDeploymentProvider,
    private contractsService: ContractsService,
    private trustSigilContractService: TrustSigilContractService,
    private eventAggregator: EventAggregator,

    private router: Router,
    private walletService: WalletService,
    private _DevService: _DevService
  ) {
    document.addEventListener(
      "lit-ready",
      function (e) {
        console.log(">>> LIT network is ready");
      },
      false
    );

    // DEV
    document.addEventListener("keydown", (ev: KeyboardEvent) => {
      if (ev.key === "c") {
        console.clear();
      }
    });

    /**
     * Else lit modal for getting authSig does not open.
     * I looked into the lit-connect-modal package to find that out
     */
    window.localStorage.setItem("lit-web3-provider", "metamask");
  }

  async attached(): Promise<void> {
    // this.litModalInit();

    // First - Needs to happen before all others
    await ContractsDeploymentProvider.initAll();
    await this.walletService.connect();

    // Second
    await this.contractsService.initializeContracts();
    await this.orbisService.initOrbisData(WOT_HACKATHON_ORBIS_GROUP_ID);
    this.subscribeEvents();
    this.initVars();

    // Second - After
    await this.trustSigilContractService.init();
    await this.trustSigilContractService.listenToSigilMintedEvent();

    // Third - Run disconnected if wanted
    if (this._DevService.runConnected) {
      await this.litActionsService.connect();
    }

    // Fourth - DEV
    this.connectionStatus = !!this.walletService.defaultAccountAddress;
    if (!this._DevService.isProduction) {
      // this._DevService.setupSigils();
    }

    // @ts-ignore
    window.app = this;

    // await this.litActionsService.isFollowing_rawOrbisApi(litActionCode);

    // const res = await this.orbisService.followUser(USER_SECOND.did)
  }

  detached() {
    this.subscriptions.forEach((sub) => sub.dispose());
  }

  private initVars() {
    this.selectedUserDid = this.walletService.defaultAccountDid;
  }

  private subscribeEvents() {
    this.subscriptions.push(
      this.eventAggregator.subscribe(UserChangedEvent, (changedDid: DID) => {
        /* prettier-ignore */ console.log('>>>> _ >>>> ~ file: app.ts ~ line 109 ~ changedDid', changedDid)
        this.selectedUserDid = changedDid;
        /* prettier-ignore */ console.log('>>>> _ >>>> ~ file: app.ts ~ line 111 ~ this.selectedUserDid', this.selectedUserDid)
      })
    );
  }

  async litModalInit() {
    const providerOptions = {
      walletconnect: {
        package: WalletConnectProvider, // required
        options: {
          infuraId: "cd614bfa5c2f4703b7ab0ec0547d9f81",
          rpc: {
            1: "https://eth-mainnet.alchemyapi.io/v2/EuGnkVlzVoEkzdg0lpCarhm8YHOxWVxE",
            5: "https://goerli.infura.io/v3/96dffb3d8c084dec952c61bd6230af34",
          },
          chainId: 5,
        },
      },
    };

    console.log(
      "hehehe ------------------------------------------------------------------------------------------"
    );

    const dialog = new LitConnectModal({
      providerOptions,
    });
    let provider;
    try {
      provider = await dialog.getWalletProvider();
    } catch (error) {
      /* prettier-ignore */ console.log('>>>> _ >>>> ~ file: eth.js ~ line 87 ~ error', error)
    }
  }

  private checkReadyForLaunch() {
    myExpect(
      this.connectionStatus,
      "1. Not connected to Wallet. Press connect button."
    );
    myExpect(
      !!this._DevService.runConnected,
      "2.1 _DevService.runConnected should be true"
    );
    myExpect(
      this._DevService.isProduction,
      "2.2 _DevService.isProduction should be true"
    );
    myExpect(!!this.orbisService.connectedUser.did, "3. Should have Orbis Did");
    const orbisAndWalletSame =
      this.walletService.defaultAccountDid.toLowerCase() ===
      this.orbisService.connectedUser.did.toLowerCase();
    myExpect(
      orbisAndWalletSame,
      `4. Wallet and Orbis should be same. Was\n Wallet: ${this.walletService.defaultAccountDid} \n Orbis: ${this.orbisService.connectedUser.did}`
    );

    console.log("No warning? Good to go!");
  }

  private changePkp(newPkp: string) {
    this.litActionsService.pkp = newPkp
    console.log('Updated pkp: ', newPkp)
  }

  private configureRouter(config: RouterConfiguration, router: Router) {
    config.title = " ";
    config.options.pushState = true;
    config.options.root = "/";

    config.useViewPortDefaults({
      profileRouterView: {
        moduleId: PLATFORM.moduleName("./pages/profile/profile"),
      },
    });

    config.map([
      {
        nav: true,
        name: "home",
        route: ["", "/", "home"],
        title: "Home",
        viewPorts: {
          default: {
            moduleId: PLATFORM.moduleName("./pages/home/home"),
          },
        },
      },
      // {
      //   nav: false,
      //   name: "profile",
      //   route: ["profile/:did"],
      //   title: "Profile",
      //   viewPorts: {
      //     default: {
      //       moduleId: null,
      //     },
      //     profileRouterView: {
      //       moduleId: PLATFORM.moduleName("./pages/profile/profile"),
      //     },
      //   },
      // },
      {
        nav: true,
        name: "events",
        route: ["events"],
        title: "Events",
        viewPorts: {
          default: {
            moduleId: PLATFORM.moduleName("./pages/events/events"),
          },
        },
        settings: {
          isNavgiationChip: true,
        },
      },
      {
        nav: true,
        name: "sigils",
        route: ["sigils"],
        title: "Sigils",
        viewPorts: {
          default: {
            moduleId: PLATFORM.moduleName("./pages/sigils/sigils"),
          },
        },
        settings: {
          isNavgiationChip: true,
        },
      },
      {
        nav: true,
        name: "group",
        route: ["groups"],
        title: "Groups",
        viewPorts: {
          default: {
            moduleId: PLATFORM.moduleName("./pages/group/group"),
          },
        },
        settings: {
          isNavgiationChip: true,
        },
      },
      {
        nav: true,
        name: "playground",
        route: ["playground"],
        title: "Playground",
        viewPorts: {
          default: {
            moduleId: PLATFORM.moduleName("./pages/playground/playground"),
          },
        },
      },
    ]);

    this.router = router;
  }
}
