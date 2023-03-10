/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Orbis } from "@orbisclub/orbis-sdk";
import { observable, singleton } from "aurelia-framework";
import { CONNECTED_USER } from "shared/fixtures";
import { ORBIS_GROUP_MEMBERS } from "shared/fixtures";
import { DID, GroupMemberStream, OrbisUser } from "types";

import { _DevService } from "./_DevService";
import { Utils } from "shared/utils";

export const WOT_HACKATHON_ORBIS_GROUP_ID =
  "kjzl6cwe1jw147lv17xkl7679toynk5lkbotwhcabvgho0qumzjsyzpay2ug9ei"; // wot-hackathon

class MockOrbis {
  public api = {
    restUrl: "https://ylgfjdlgyjmdikqavpcj.supabase.co/rest/v1",
    // @ts-ignore
    supabaseKey: process.env.supabaseKey,
  };

  isConnected() {
    return {
      status: 200,
      details: CONNECTED_USER,
      did: CONNECTED_USER.did,
    };
  }

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
    };
  }
}

@singleton(false)
export class OrbisService {
  public orbis: IOrbis;
  public initializing = true;
  // @ts-ignore
  public connectedUser: OrbisUser;
  public groupMembers: GroupMemberStream[];
  public baseUrl: string;
  public apiKey: string;
  private initializedPromise: Promise<unknown>;

  constructor(private _DevService: _DevService) {
    this._DevService.OrbisService = this;
    this.orbis = this._DevService.runConnected ? new Orbis() : new MockOrbis();

    // @ts-ignore
    this.baseUrl = this.orbis.api.restUrl;
    // @ts-ignore
    this.apiKey = this.orbis.api.supabaseKey;

    this.initializedPromise = Utils.waitUntilTrue(
      () => !this.initializing,
      9999999999
    );
  }

  public async ensureLoaded() {
    return this.initializedPromise;
  }

  async initOrbisData(groupId: string) {
    // @ts-ignore
    this.connectedUser = await this.loadOrbisUser();
    // await this.loadOrbisGroup();
    this.groupMembers = await this.loadOrbisGroupMember(groupId);
    this.initializing = false;
  }

  async loadOrbisUser() {
    const user = await checkUserIsConnected(this.orbis);
    /* prettier-ignore */ console.log('>>>> _ >>>> ~ file: app.ts ~ line 22 ~ user', user)
    return user;
  }

  async loadOrbisGroup(groupId: string) {
    const { data, error } = await this.orbis.getGroup(groupId);
    /* prettier-ignore */ console.log('>>>> _ >>>> ~ file: app.ts ~ line 18 ~ data', data)
  }

  async loadOrbisGroupMember(groupId: string): Promise<GroupMemberStream[]> {
    const { data, error } = await this.orbis.getGroupMembers(groupId);
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
    if (!this._DevService.runConnected) {
      return true;
    }

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

  public async connect() {
    // @ts-ignore
    const response = await this.orbis.connect();
    /* prettier-ignore */ console.log('Connect response', response)
    this.connectedUser = {
      did: response.did,
      metadata: response.details.metadata,
    };
  }

  public async logout() {
    const response = await this.orbis.logout();
    /* prettier-ignore */ console.log('Logout response', response)
  }

  public async reloadGroup(newGroupId: string) {
    /* prettier-ignore */ console.log('>>>> _ >>>> ~ file: OrbisService.ts ~ line 186 ~ newGroupId', newGroupId)
    await this.initOrbisData(newGroupId)
  }
}

async function checkUserIsConnected(orbis) {
  const res = await orbis?.isConnected();
  /* prettier-ignore */ console.log('>>>> _ >>>> ~ file: OrbisService.ts ~ line 151 ~ res', res)

  if (res === false) {
    const temp = await orbis.connect();
    /* prettier-ignore */ console.log('>>>> _ >>>> ~ file: OrbisService.ts ~ line 156 ~ temp', temp)
  }

  /** If SDK returns user details we save it in state */
  if (res && res.status == 200) {
    return res.details ?? res.did;
  }
}
