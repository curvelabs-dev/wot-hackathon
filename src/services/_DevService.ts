import { singleton } from "aurelia-framework";
import { OrbisService } from "./OrbisService";

@singleton()
export class _DevService {
  public static OrbisService: OrbisService;
  public static get isOrbisActive() {
    const is = this.OrbisService.orbis && this.OrbisService.initiated;
    return is
  }
}
