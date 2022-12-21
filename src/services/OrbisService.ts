/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Orbis } from "@orbisclub/orbis-sdk";
import { singleton } from "aurelia-framework";
import { USER_FIRST } from "shared/constants";
import { ORBIS_GROUP_MEMBERS } from "shared/fixtures";
import { DID, GroupMemberStream, OrbisUser } from "types";

import { _DevService } from "./_DevService";
import ENV from "../../env.json";

const group_id =
  "kjzl6cwe1jw147lv17xkl7679toynk5lkbotwhcabvgho0qumzjsyzpay2ug9ei"; // wot-hackathon

class MockOrbis {
  public api = {
    restUrl: "https://ylgfjdlgyjmdikqavpcj.supabase.co/rest/v1",
    // @ts-ignore
    supabaseKey: ENV.supabaseKey,
  };

  getIsFollowing(a, b) {
    return { data: false, error: undefined };
  }

  getGroup(id) {
    return { data: {}, error: undefined };
  }

  setFollow(did, bool) {
    return;
  }

  getGroupMembers(group_id: string) {
    return {
      data: ORBIS_GROUP_MEMBERS,
      error: undefined,
    }
  }
}

@singleton(false)
export class OrbisService {
  public orbis = new MockOrbis();
  // public orbis: IOrbis = new Orbis();
  public initiated = false;
  // @ts-ignore
  public connectedUser: OrbisUser = { did: USER_FIRST.did };
  public groupMembers: GroupMemberStream[];
  public baseUrl: string;
  public apiKey: string;

  constructor() {
    _DevService.OrbisService = this;

    // @ts-ignore
    this.baseUrl = this.orbis.api.restUrl;
    // @ts-ignore
    this.apiKey = this.orbis.api.supabaseKey;
  }

  async initOrbisData() {
    // this.connectedUser = await this.loadOrbisUser();
    // await this.loadOrbisGroup();
    this.groupMembers = await this.loadOrbisGroupMember();

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
    const { data, error } = await this.orbis.getGroupMembers(group_id);
    /* prettier-ignore */ console.log('>>>> _ >>>> ~ file: OrbisService.ts ~ line 45 ~ data', data)
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
   * Call Orbis API directly.
   *
   * // const url = `${this.baseUrl}/orbis_v_followers?select=details:did_followed_details&did_following=eq.${didFollowing}&active=eq.true` // all followers?
   *
   * @param didFollowing Did of the user following
   * @param didFollowed Did of the user being followed
   */
  public async rawIsFollowing(didFollowing: DID, didFollowed: DID) {
    const url = `${this.baseUrl}/orbis_v_followers?select=*&did_following=eq.${didFollowing}&did_followed=eq.${didFollowed}&active=eq.true`;

    const rawResponse = await fetch(url, {
      headers: {
        apikey: this.apiKey,
      },
    });
    const response = await rawResponse.json();

    if (response.length === 0) {
      return false;
    }

    const isFollowing = response[0].active === "true";
    return isFollowing;
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
