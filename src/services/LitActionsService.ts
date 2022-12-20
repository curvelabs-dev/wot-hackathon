/* eslint-disable @typescript-eslint/ban-ts-comment */
import LitJsSdk from "lit-js-sdk";
import { OrbisService } from "./OrbisService";
import { publicKey } from "../../env.json";
import { autoinject } from "aurelia-framework";
import { DID } from "types";

@autoinject
export class LitActionsService {
  public authSig;

  private litNodeClient;

  constructor(private orbisService: OrbisService) {}

  public async connect() {
    // @ts-ignore
    const litNodeClient = new LitJsSdk.LitNodeClient({
      litNetwork: "serrano",
    });
    this.litNodeClient = litNodeClient;
    const connected = await litNodeClient.connect();
    /* prettier-ignore */ console.log('>>>> _ >>>> ~ file: LitActionsService.ts ~ line 30 ~ connected', connected)

    // you need an AuthSig to auth with the nodes
    // this will get it from metamask or any browser wallet
    // @ts-ignore
    this.authSig = await LitJsSdk.checkAndSignAuthMessage({
      // chain: 'ethereum'
      chain: "goerli",
    });

    return connected;
  }

  /**
   * Checkout OrbisService#rawIsFollowing for the `code` part or for testing
   */
  public async isFollowing_rawOrbisApi(didFollowing: DID, didFollowed: DID) {
    const url = `${this.orbisService.baseUrl}/orbis_v_followers?select=*&did_following=eq.${didFollowing}&did_followed=eq.${didFollowed}&active=eq.true`;

    const code = `
      const go = async () => {
        const rawResponse = await fetch("${url}", {
          headers: {
            apikey: "${this.orbisService.apiKey}",
          },
        });
        const response = await rawResponse.json();

        // Lit.Actions.setResponse({ response: JSON.stringify(response) });
        const isFollowing = response[0].active === "true";

        // all the params (toSign, publicKey, sigName) are passed in from the LitJsSdk.executeJs() function
        const sigShare = await LitActions.signEcdsa({
          toSign: response,
          publicKey,
          sigName
        });
      }
      go();
    `;

    code
    /* prettier-ignore */ console.log('>>>> _ >>>> ~ file: LitActionsService.ts ~ line 75 ~ code', code)
    // return

    const runLitAction = async () => {
      const signatures = await this.litNodeClient.executeJs({
        code,
        authSig: this.authSig,
        // all jsParams can be used anywhere in your litActionCode
        jsParams: {
          publicKey: publicKey,
          sigName: "sig1",
        },
      });
      console.log("signatures: ", signatures);
    };

    runLitAction();
  }
}
