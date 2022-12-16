import { Orbis } from "@orbisclub/orbis-sdk";
import { singleton } from "aurelia-framework";
import { USER_FIRST } from "shared/constants";
import { DID, GroupMemberStream, OrbisUser } from "types";
import { _DevService } from "./_DevService";

const group_id =
  "kjzl6cwe1jw147lv17xkl7679toynk5lkbotwhcabvgho0qumzjsyzpay2ug9ei"; // wot-hackathon

@singleton(false)
export class OrbisService {
  // public orbis = new Orbis();
  public orbis;
  public initiated = false;
  // @ts-ignore
  public connectedUser: OrbisUser = { did: USER_FIRST.did };
  public groupMembers: GroupMemberStream[];

  constructor() {
    _DevService.OrbisService = this;
  }

  async initOrbisData() {
    // this.connectedUser = await this.loadOrbisUser();
    // await this.loadOrbisGroup();
    // this.groupMembers = await this.loadOrbisGroupMember();

    this.initiated = true;
  }

  async loadOrbisUser() {
    const user = await checkUserIsConnected(this.orbis);
    /* prettier-ignore */ console.log('>>>> _ >>>> ~ file: app.ts ~ line 22 ~ user', user)
    return user;
  }

  async loadOrbisGroup() {
    const { data, error } = await this.orbis.getGroup(group_id);
    /* prettier-ignore */ console.log('>>>> _ >>>> ~ file: app.ts ~ line 18 ~ data', data)
  }

  async loadOrbisGroupMember(): Promise<GroupMemberStream[]> {
    const { data, error, status } = await this.orbis.getGroupMembers(group_id);
    /* prettier-ignore */ console.log('>>>> _ >>>> ~ file: OrbisService.ts ~ line 42 ~ data', data)
    // const members = data[0].collection
    // /* prettier-ignore */ console.log('>>>> _ >>>> ~ file: OrbisService.ts ~ line 44 ~ members', members)

    return data as GroupMemberStream[];
  }

  /**
   * @param didFollowing Did of the user following
   * @param didFollowed Did of the user being followed
   */
  public async isFollowing(didFollowing: DID, didFollowed: DID) {
    const { data, error } = await this.orbis.getIsFollowing(
      didFollowing,
      didFollowed
    );

    if (error) {
      console.error(error);
    }

    return data;
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
