import { autoinject, PLATFORM } from "aurelia-framework";
import { Router, RouterConfiguration } from "aurelia-router";
import LitConnectModal from "lit-connect-modal";
import WalletConnectProvider from "@walletconnect/ethereum-provider";

import { OrbisService } from "services/OrbisService";
import { WalletService } from "services/WalletService";
import { _DevService } from "services/_DevService";
import { LitActionsService } from "services/LitActionsService";
import "./types";
import { myExpect } from "modules/expect";
import { USER_SECOND } from "shared/constants";

import "./styles/globals.css";
import "./styles/utilities.css";
import "./styles/responsive.css";
import "./styles/Home.css";
import "./app.scss";
import { publicKey } from "../env.json";

@autoinject
export class App {
  public message = "Hello World!";
  private connectionStatus: boolean;
  private _DevService = _DevService;

  constructor(
    private orbisService: OrbisService,
    private litActionsService: LitActionsService,
    private router: Router,
    private walletService: WalletService
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

    await this.walletService.connect();
    await this.orbisService.initOrbisData();

    await this.litActionsService.connect();

    // await this.litActionsService.isFollowing_rawOrbisApi(litActionCode);

    // const res = await this.orbisService.followUser(USER_SECOND.did)
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
    myExpect(!!this.connectionStatus, "1. Not connect. Press connect button.");
    myExpect(
      !!this._DevService.isOrbisActive,
      "2. Orbis not active, In OrbisService, activate orbis by `new Orbis()`"
    );
  }

  private configureRouter(config: RouterConfiguration, router: Router) {
    config.title = " ";
    config.options.pushState = true;
    config.options.root = "/";

    config.map([
      {
        moduleId: PLATFORM.moduleName("./pages/home/home"),
        nav: true,
        name: "home",
        route: ["", "/", "home"],
        title: "Home",
      },
      {
        moduleId: PLATFORM.moduleName("./pages/group/group"),
        nav: true,
        name: "group",
        route: ["group"],
        title: "Group",
      },
      {
        moduleId: PLATFORM.moduleName("./pages/profile/profile"),
        nav: false,
        name: "profile",
        route: ["profile/:did"],
        title: "Profile",
      },
      {
        moduleId: PLATFORM.moduleName("./pages/events/events"),
        nav: true,
        name: "events",
        route: ["events"],
        title: "Events",
      },
      {
        moduleId: PLATFORM.moduleName("./pages/playground/playground"),
        nav: true,
        name: "playground",
        route: ["playground"],
        title: "Playground",
      },
    ]);

    this.router = router;
  }
}
