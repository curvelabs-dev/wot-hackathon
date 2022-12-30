/* eslint-disable @typescript-eslint/ban-ts-comment */
import { OrbisService } from "./OrbisService";
import { autoinject } from "aurelia-framework";
import { DID, ILitActionSignatureResponse } from "types";
import { useDidToAddress } from "modules/did";
import { _DevService } from "./_DevService";
import {
  arrayify,
  computePublicKey,
  joinSignature,
  recoverAddress,
  recoverPublicKey,
  solidityKeccak256,
  splitSignature,
  verifyMessage,
} from "ethers/lib/utils";

@autoinject
export class LitActionsService {
  public authSig;
  public pkp = process.env.publicKey;

  private litNodeClient;

  constructor(
    private orbisService: OrbisService,
    private _DevService: _DevService
  ) {}

  public async connect() {
    const LitJsSdk = await import("lit-js-sdk");
    // @ts-ignore
    const litNodeClient = new LitJsSdk.LitNodeClient({
      litNetwork: "serrano",
    });
    this.litNodeClient = litNodeClient;
    const connected = await litNodeClient.connect();

    // you need an AuthSig to auth with the nodes
    // this will get it from metamask or any browser wallet
    // @ts-ignore
    this.authSig = await LitJsSdk.checkAndSignAuthMessage({
      // chain: 'ethereum'
      chain: "goerli", // TODO take from WalletSevice
    });

    return connected;
  }

  /**
   * Checkout OrbisService#rawIsFollowing for the `code` part or for testing
   */
  public async isFollowing_rawOrbisApi(didFollowing: DID, didFollowed: DID) {
    if (!this._DevService.runConnected) {
      return {
        isFollowing: true,
        signatures: [], // not needed when disconnected
      };
    }

    const url = `${this.orbisService.baseUrl}/orbis_v_followers?select=*&did_following=eq.${didFollowing}&did_followed=eq.${didFollowed}&active=eq.true`;
    const addressFollowing = useDidToAddress(didFollowing);
    /* prettier-ignore */ console.log('>>>> _ >>>> ~ file: LitActionsService.ts ~ line 43 ~ addressFollowing', addressFollowing)
    const addressFollowed = useDidToAddress(didFollowed);
    /* prettier-ignore */ console.log('>>>> _ >>>> ~ file: LitActionsService.ts ~ line 45 ~ addressFollowed', addressFollowed)

    // Lit.Actions.setResponse({ response: JSON.stringify(response) });

    const messageHash = solidityKeccak256(
      ["address", "address"],
      [addressFollowing, addressFollowed]
    );
    /* prettier-ignore */ console.log('>>>> _ >>>> ~ file: LitActionsService.ts ~ line 73 ~ messageHash', messageHash)

    // STEP 2: 32 bytes of data in Uint8Array
    const messageHashBinary = arrayify(messageHash);
    const code = `
      const go = async () => {
        const utils = ethers.utils;

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

        console.log("signEcdsa")
        const sigShare = await LitActions.signEcdsa({
          toSign: messageHashBinary,
          publicKey,
          sigName
        });
      }
      go();
    `;

    /* prettier-ignore */ console.log('>>>> _ >>>> ~ file: LitActionsService.ts ~ line 111 ~ this.pkp', this.pkp)

    const signatures = (await this.litNodeClient.executeJs({
      code,
      authSig: this.authSig,
      // all jsParams can be used anywhere in your litActionCode
      jsParams: {
        messageHashBinary,
        publicKey: this.pkp,
        sigName: "sig1",
      },
    })) as ILitActionSignatureResponse;

    /* prettier-ignore */ console.log('>>>> _ >>>> ~ file: LitActionsService.ts ~ line 85 ~ signatures', signatures)

    const isFollowing = Object.keys(signatures.signatures).length > 0;

    stuff(signatures.signatures, messageHashBinary);

    return {
      isFollowing,
      signatures: signatures.signatures.sig1.signature,
    };
  }
}
function stuff(signatures, message) {
  const sig = signatures.sig1;
  const dataSigned = sig.dataSigned;
  const encodedSig = joinSignature({
    r: "0x" + sig.r,
    s: "0x" + sig.s,
    v: sig.recid,
  });

  console.log("encodedSig", encodedSig);
  console.log("sig length in bytes: ", encodedSig.substring(2).length / 2);
  // 0xb85e49d6aaffc46eeea998a7c48ae15b33d0a4881b15f0f9d0c22d308a54ed1b
  console.log("1 dataSigned", dataSigned);
  console.log("2 arrayify(dataSigned)", arrayify(dataSigned));
  const splitSig = splitSignature(encodedSig);
  console.log("splitSig", splitSig);

  // return;

  const recoveredPubkey = recoverPublicKey(arrayify(dataSigned), encodedSig);
  console.log("uncompressed recoveredPubkey", recoveredPubkey);
  const compressedRecoveredPubkey = computePublicKey(recoveredPubkey, true);
  console.log("compressed recoveredPubkey", compressedRecoveredPubkey);
  const recoveredAddress = recoverAddress(dataSigned, encodedSig);
  console.log("recoveredAddress", recoveredAddress);

  const recoveredAddressViaMessage = verifyMessage(message, encodedSig);
  console.log("recoveredAddressViaMessage", recoveredAddressViaMessage);
}
