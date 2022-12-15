import { autoinject, PLATFORM } from "aurelia-framework";
import {
  Router,
  RouterConfiguration,
  NavigationInstruction,
  Next,
} from "aurelia-router";

import { OrbisService } from "services/OrbisService";
import { WalletService } from "services/WalletService";
import { _DevService } from "services/_DevService";
import "./types";
import { myExpect } from "modules/expect";
import { USER_SECOND } from "shared/constants";

import './styles/globals.css'
import './styles/utilities.css'
import './styles/responsive.css'
import './styles/Home.css'
import "./app.scss";

@autoinject
export class App {
  public message = "Hello World!";
  private connectionStatus: boolean;
  private _DevService = _DevService;

  constructor(
    private orbisService: OrbisService,
    private router: Router,
    private walletService: WalletService
  ) {}

  async attached(): Promise<void> {
    await this.walletService.connect();
    // await this.orbisService.initOrbisData();

    // const res = await this.orbisService.followUser(USER_SECOND.did)
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
      { moduleId: PLATFORM.moduleName("./pages/home/home"), nav: true, name: "home", route: ["", "/", "home"], title: "Home", },
      { moduleId: PLATFORM.moduleName("./pages/playground/playground"), nav: true, name: "playground", route: ["playground"], title: "Playground", },
    ]);

    this.router = router
  }
}
