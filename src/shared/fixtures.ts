import { convertToDid } from "modules/did";
import { Address } from "types";

export const FIRST_ADDRESS = "0xB86fa0cfEEA21558DF988AD0ae22F92a8EF69AC1";
export const SECOND_ADDRESS = "0xE834627cDE2dC8F55Fe4a26741D3e91527A8a498";
export const THIRD_ADDRESS = "0xbf3a5599f2f6ce89862d640a248e31f30b7ddf29";
export const HARDHAT_FIRST_ADDRESS =
  "0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266";

export const ALL_USERS_ADDRESSES = [
  FIRST_ADDRESS,
  SECOND_ADDRESS,
  THIRD_ADDRESS,
  HARDHAT_FIRST_ADDRESS,
];

export const USER_FIRST = createUser(FIRST_ADDRESS);
export const USER_SECOND = createUser(SECOND_ADDRESS);
export const USER_HARDHAT_FIRST = createUser(HARDHAT_FIRST_ADDRESS);

function createUser(address: Address) {
  return {
    address,
    did: convertToDid(address.toLowerCase()),
  };
}

export const CONNECTED_USER = USER_HARDHAT_FIRST;

export const ORBIS_GROUP_MEMBERS = [
  {
    stream_id:
      "kjzl6cwe1jw148bjfjqbhbtaigz8ii7cffmvq3anzx4rvxxq5h9w0595w8j2f2d",
    group_id: "kjzl6cwe1jw147lv17xkl7679toynk5lkbotwhcabvgho0qumzjsyzpay2ug9ei",
    content: {
      active: true,
      group_id:
        "kjzl6cwe1jw147lv17xkl7679toynk5lkbotwhcabvgho0qumzjsyzpay2ug9ei",
    },
    active: "true",
    created_at: "2022-12-21T19:13:05.465907+00:00",
    timestamp: 1671649985,
    profile_details: {
      did: "did:pkh:eip155:5:0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266",
      profile: {},
    },
  },
  {
    stream_id:
      "kjzl6cwe1jw149nzhibcbdb76jc3xyrfj0qvdn9vnkfh80aqpwm3b4il0bzo406",
    group_id: "kjzl6cwe1jw147lv17xkl7679toynk5lkbotwhcabvgho0qumzjsyzpay2ug9ei",
    content: {
      active: true,
      group_id:
        "kjzl6cwe1jw147lv17xkl7679toynk5lkbotwhcabvgho0qumzjsyzpay2ug9ei",
    },
    active: "true",
    created_at: "2022-12-19T13:43:37.227601+00:00",
    timestamp: 1671457417,
    profile_details: {
      did: "did:pkh:eip155:1:0xbf3a5599f2f6ce89862d640a248e31f30b7ddf29",
      profile: null,
    },
  },
  {
    stream_id:
      "kjzl6cwe1jw147ttuhnyg7fay68yt9m4mojhl5lflvs9kp10u03h726fehh8dja",
    group_id: "kjzl6cwe1jw147lv17xkl7679toynk5lkbotwhcabvgho0qumzjsyzpay2ug9ei",
    content: {
      active: true,
      group_id:
        "kjzl6cwe1jw147lv17xkl7679toynk5lkbotwhcabvgho0qumzjsyzpay2ug9ei",
    },
    active: "true",
    created_at: "2022-12-16T00:22:42.347759+00:00",
    timestamp: 1671150149,
    profile_details: {
      did: "did:pkh:eip155:1:0xb86fa0cfeea21558df988ad0ae22f92a8ef69ac1",
      profile: null,
    },
  },
  {
    stream_id:
      "kjzl6cwe1jw145ioa6dxeij2xifpgq2i8nsbqd9mqm5ljh6l7ebwlbfmdkveyu9",
    group_id: "kjzl6cwe1jw147lv17xkl7679toynk5lkbotwhcabvgho0qumzjsyzpay2ug9ei",
    content: {
      active: true,
      group_id:
        "kjzl6cwe1jw147lv17xkl7679toynk5lkbotwhcabvgho0qumzjsyzpay2ug9ei",
    },
    active: "true",
    created_at: "2022-12-15T21:48:37.363498+00:00",
    timestamp: 1671140917,
    profile_details: {
      did: "did:pkh:eip155:1:0xe834627cde2dc8f55fe4a26741d3e91527a8a498",
      profile: null,
    },
  },
];
