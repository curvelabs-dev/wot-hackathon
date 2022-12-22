/* eslint-disable @typescript-eslint/ban-ts-comment */
import { OrbisService } from "./OrbisService";
import { publicKey } from "../../env.json";
import { autoinject } from "aurelia-framework";
import { DID, ILitActionSignatureResponse } from "types";
import useDidToAddress from "modules/did";

@autoinject
export class LitActionsService {
  public authSig;

  private litNodeClient;

  constructor(private orbisService: OrbisService) {}

  public async connect() {
    const LitJsSdk = await import("lit-js-sdk");
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
    const addressFollowing = useDidToAddress(didFollowing);
    /* prettier-ignore */ console.log('>>>> _ >>>> ~ file: LitActionsService.ts ~ line 43 ~ addressFollowing', addressFollowing)
    const addressFollowed = useDidToAddress(didFollowed);
    /* prettier-ignore */ console.log('>>>> _ >>>> ~ file: LitActionsService.ts ~ line 45 ~ addressFollowed', addressFollowed)

    // Lit.Actions.setResponse({ response: JSON.stringify(response) });
    const code = `
      const go = async () => {
        const utils = ethers.utils;

        let messageHash = utils.solidityKeccak256(
          ["address", "address"],
          ["${addressFollowing}", "${addressFollowed}"],
        );

        // STEP 2: 32 bytes of data in Uint8Array
        let messageHashBinary = utils.arrayify(messageHash)
        /* prettier-ignore */ console.log('>>>> _ >>>> ~ file: LitActionsService.ts ~ line 54 ~ messageHashBinary', messageHashBinary)

        const rawResponse = await fetch("${url}", {
          headers: {
            apikey: "${this.orbisService.apiKey}",
          },
        });
        const response = await rawResponse.json();

        if (response.length === 0) {
          return false;
        }

        const isFollowing = response[0].active === "true";

        // all the params (toSign, publicKey, sigName) are passed in from the LitJsSdk.executeJs() function
        const sigShare = await LitActions.signEcdsa({
          toSign: messageHashBinary,
          publicKey,
          sigName
        });
      }
      go();
    `;

    const signatures = (await this.litNodeClient.executeJs({
      code,
      authSig: this.authSig,
      // all jsParams can be used anywhere in your litActionCode
      jsParams: {
        publicKey: publicKey,
        sigName: "sig1",
      },
    })) as ILitActionSignatureResponse;

    /* prettier-ignore */ console.log('>>>> _ >>>> ~ file: LitActionsService.ts ~ line 85 ~ signatures', signatures)

    const isFollowing = Object.keys(signatures.signatures).length > 0;

    return {
      isFollowing,
      signatures: signatures.signatures.sig1.signature,
    };
  }
}
