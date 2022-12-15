import { Orbis } from "@orbisclub/orbis-sdk";
import { singleton } from "aurelia-framework";
import { OrbisUser } from "types";
import { _DevService } from "./_DevService";

const group_id =
  "kjzl6cwe1jw147lv17xkl7679toynk5lkbotwhcabvgho0qumzjsyzpay2ug9ei"; // wot-hackathon

@singleton(false)
export class OrbisService {
  // orbis = new Orbis();
  orbis;
  initiated = false;
  user: OrbisUser;

  constructor() {
    _DevService.OrbisService = this;
  }

  async initOrbisData() {
    this.user = await this.loadOrbisUser();
    await this.loadOrbisGroups();

    this.initiated = true;
  }

  async loadOrbisUser() {
    const user = await checkUserIsConnected(this.orbis);
    /* prettier-ignore */ console.log('>>>> _ >>>> ~ file: app.ts ~ line 22 ~ user', user)
    return user
  }

  async loadOrbisGroups() {
    // const { data, error } = await orbis.getGroup(group_id);
    // /* prettier-ignore */ console.log('>>>> _ >>>> ~ file: app.ts ~ line 18 ~ data', data)
  }

  /**
   * https://orbis.club/documentation/api-documentation/setFollow
   */
  public async followUser(did) {
    const res = await this.orbis?.setFollow(did, true);
    return res;
  }

  /**
   * https://orbis.club/documentation/api-documentation/setFollow
   */
  public async unfollowUser(did) {
    const res = await this.orbis?.setFollow(did, false);
    return res;
  }
}

async function checkUserIsConnected(orbis) {
  const res = await orbis?.isConnected();

  /** If SDK returns user details we save it in state */
  if (res && res.status == 200) {
    return res.details;
  }
}
