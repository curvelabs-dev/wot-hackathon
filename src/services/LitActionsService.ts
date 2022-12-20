import LitJsSdk from "lit-js-sdk";
import { publicKey } from "../../env.json"
/* prettier-ignore */ console.log('>>>> _ >>>> ~ file: LitActionsService.ts ~ line 3 ~ publicKey', publicKey)

export class LitActionsService {
  public async helloWorld() {
    // this code will be run on the node
    const litActionCode = `
    const go = async () => {
      // this is the string "Hello World" for testing
      const toSign = [72, 101, 108, 108, 111, 32, 87, 111, 114, 108, 100];
      // this requests a signature share from the Lit Node
      // the signature share will be automatically returned in the HTTP response from the node
      const sigShare = await Lit.Actions.signEcdsa({
        toSign,
        publicKey: "${publicKey}",
        sigName: "sig1",
      });
    };

    go();
    `;

    const runLitAction = async () => {
      /* prettier-ignore */ console.log('>>>> _ >>>> ~ file: LitActionsService.ts ~ line 52 ~ LitJsSdk', LitJsSdk)

      // @ts-ignore
      const litNodeClient = new LitJsSdk.LitNodeClient({
        litNetwork: "serrano",
      });
      const connected = await litNodeClient.connect();
      // /* prettier-ignore */ console.log('>>>> _ >>>> ~ file: LitActionsService.ts ~ line 33 ~ litNodeClient', litNodeClient)

      // you need an AuthSig to auth with the nodes
      // this will get it from metamask or any browser wallet
      // @ts-ignore
      const authSig = await LitJsSdk.checkAndSignAuthMessage({
        // chain: 'ethereum'
        chain: 'goerli'
      });

      // @ts-ignore
      /* prettier-ignore */ console.log('>>>> _ >>>> ~ file: LitActionsService.ts ~ line 30 ~ connected', connected)
      const signatures = await litNodeClient.executeJs({
        code: litActionCode,
        authSig,
        // all jsParams can be used anywhere in your litActionCode
        jsParams: {
          // this is the string "Hello World" for testing
          toSign: [72, 101, 108, 108, 111, 32, 87, 111, 114, 108, 100],
          publicKey: publicKey,
          sigName: "sig1",
        },
      });
      console.log("signatures: ", signatures);
    };

    runLitAction();
  }

  // public runLitAction = async () => {
  //   // you need an AuthSig to auth with the nodes
  //   // this will get it from metamask or any browser wallet
  //   const authSig = await LitJsSdk.checkAndSignAuthMessage({
  //     chain: "ethereum",
  //   });

  //   const litNodeClient = new LitJsSdk.LitNodeClient({ litNetwork: "serrano" });
  //   await litNodeClient.connect();
  //   const signatures = await litNodeClient.executeJs({
  //     code: litActionCode,
  //     authSig,
  //     // all jsParams can be used anywhere in your litActionCode
  //     jsParams: {
  //       // this is the string "Hello World" for testing
  //       toSign: [72, 101, 108, 108, 111, 32, 87, 111, 114, 108, 100],
  //       publicKey:
  //         "0x02e5896d70c1bc4b4844458748fe0f936c7919d7968341e391fb6d82c258192e64",
  //       sigName: "sig1",
  //     },
  //   });
  //   console.log("signatures: ", signatures);
  // };
}
