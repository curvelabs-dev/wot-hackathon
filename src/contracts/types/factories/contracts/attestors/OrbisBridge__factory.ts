/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import { Signer, utils, Contract, ContractFactory, Overrides } from "ethers";
import type { Provider, TransactionRequest } from "@ethersproject/providers";
import type { PromiseOrValue } from "../../../common";
import type {
  OrbisBridge,
  OrbisBridgeInterface,
} from "../../../contracts/attestors/OrbisBridge";

const _abi = [
  {
    inputs: [
      {
        internalType: "address",
        name: "_litActionPkp",
        type: "address",
      },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "sender",
        type: "address",
      },
      {
        internalType: "address",
        name: "recipient",
        type: "address",
      },
      {
        internalType: "bytes",
        name: "data",
        type: "bytes",
      },
    ],
    name: "attestMint",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "litActionPkp",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
] as const;

const _bytecode =
  "0x608060405234801561001057600080fd5b50604051610b48380380610b48833981810160405281019061003291906100db565b806000806101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555050610108565b600080fd5b600073ffffffffffffffffffffffffffffffffffffffff82169050919050565b60006100a88261007d565b9050919050565b6100b88161009d565b81146100c357600080fd5b50565b6000815190506100d5816100af565b92915050565b6000602082840312156100f1576100f0610078565b5b60006100ff848285016100c6565b91505092915050565b610a31806101176000396000f3fe608060405234801561001057600080fd5b50600436106100365760003560e01c806323b037ce1461003b57806367d486951461006b575b600080fd5b610055600480360381019061005091906105f6565b610089565b6040516100629190610680565b60405180910390f35b61007361012a565b60405161008091906106aa565b60405180910390f35b600080848460405160200161009f92919061070d565b60405160208183030381529060405280519060200120905060008054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16610109846100fb8461014e565b61017e90919063ffffffff16565b73ffffffffffffffffffffffffffffffffffffffff16149150509392505050565b60008054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b60008160405160200161016191906107bb565b604051602081830303815290604052805190602001209050919050565b600080600061018d85856101a5565b9150915061019a816101f6565b819250505092915050565b60008060418351036101e65760008060006020860151925060408601519150606086015160001a90506101da8782858561035c565b945094505050506101ef565b60006002915091505b9250929050565b6000600481111561020a576102096107e1565b5b81600481111561021d5761021c6107e1565b5b03156103595760016004811115610237576102366107e1565b5b81600481111561024a576102496107e1565b5b0361028a576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016102819061086d565b60405180910390fd5b6002600481111561029e5761029d6107e1565b5b8160048111156102b1576102b06107e1565b5b036102f1576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016102e8906108d9565b60405180910390fd5b60036004811115610305576103046107e1565b5b816004811115610318576103176107e1565b5b03610358576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161034f9061096b565b60405180910390fd5b5b50565b6000807f7fffffffffffffffffffffffffffffff5d576e7357a4501ddfe92f46681b20a08360001c1115610397576000600391509150610435565b6000600187878787604051600081526020016040526040516103bc94939291906109b6565b6020604051602081039080840390855afa1580156103de573d6000803e3d6000fd5b505050602060405103519050600073ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff160361042c57600060019250925050610435565b80600092509250505b94509492505050565b6000604051905090565b600080fd5b600080fd5b600073ffffffffffffffffffffffffffffffffffffffff82169050919050565b600061047d82610452565b9050919050565b61048d81610472565b811461049857600080fd5b50565b6000813590506104aa81610484565b92915050565b600080fd5b600080fd5b6000601f19601f8301169050919050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052604160045260246000fd5b610503826104ba565b810181811067ffffffffffffffff82111715610522576105216104cb565b5b80604052505050565b600061053561043e565b905061054182826104fa565b919050565b600067ffffffffffffffff821115610561576105606104cb565b5b61056a826104ba565b9050602081019050919050565b82818337600083830152505050565b600061059961059484610546565b61052b565b9050828152602081018484840111156105b5576105b46104b5565b5b6105c0848285610577565b509392505050565b600082601f8301126105dd576105dc6104b0565b5b81356105ed848260208601610586565b91505092915050565b60008060006060848603121561060f5761060e610448565b5b600061061d8682870161049b565b935050602061062e8682870161049b565b925050604084013567ffffffffffffffff81111561064f5761064e61044d565b5b61065b868287016105c8565b9150509250925092565b60008115159050919050565b61067a81610665565b82525050565b60006020820190506106956000830184610671565b92915050565b6106a481610472565b82525050565b60006020820190506106bf600083018461069b565b92915050565b60008160601b9050919050565b60006106dd826106c5565b9050919050565b60006106ef826106d2565b9050919050565b61070761070282610472565b6106e4565b82525050565b600061071982856106f6565b60148201915061072982846106f6565b6014820191508190509392505050565b600081905092915050565b7f19457468657265756d205369676e6564204d6573736167653a0a333200000000600082015250565b600061077a601c83610739565b915061078582610744565b601c82019050919050565b6000819050919050565b6000819050919050565b6107b56107b082610790565b61079a565b82525050565b60006107c68261076d565b91506107d282846107a4565b60208201915081905092915050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052602160045260246000fd5b600082825260208201905092915050565b7f45434453413a20696e76616c6964207369676e61747572650000000000000000600082015250565b6000610857601883610810565b915061086282610821565b602082019050919050565b600060208201905081810360008301526108868161084a565b9050919050565b7f45434453413a20696e76616c6964207369676e6174757265206c656e67746800600082015250565b60006108c3601f83610810565b91506108ce8261088d565b602082019050919050565b600060208201905081810360008301526108f2816108b6565b9050919050565b7f45434453413a20696e76616c6964207369676e6174757265202773272076616c60008201527f7565000000000000000000000000000000000000000000000000000000000000602082015250565b6000610955602283610810565b9150610960826108f9565b604082019050919050565b6000602082019050818103600083015261098481610948565b9050919050565b61099481610790565b82525050565b600060ff82169050919050565b6109b08161099a565b82525050565b60006080820190506109cb600083018761098b565b6109d860208301866109a7565b6109e5604083018561098b565b6109f2606083018461098b565b9594505050505056fea2646970667358221220e240ac95cec0388a11476924279ca157a2b5fc77b50fe0d0b652e39492de63c564736f6c63430008110033";

type OrbisBridgeConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: OrbisBridgeConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class OrbisBridge__factory extends ContractFactory {
  constructor(...args: OrbisBridgeConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
  }

  override deploy(
    _litActionPkp: PromiseOrValue<string>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<OrbisBridge> {
    return super.deploy(_litActionPkp, overrides || {}) as Promise<OrbisBridge>;
  }
  override getDeployTransaction(
    _litActionPkp: PromiseOrValue<string>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(_litActionPkp, overrides || {});
  }
  override attach(address: string): OrbisBridge {
    return super.attach(address) as OrbisBridge;
  }
  override connect(signer: Signer): OrbisBridge__factory {
    return super.connect(signer) as OrbisBridge__factory;
  }

  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): OrbisBridgeInterface {
    return new utils.Interface(_abi) as OrbisBridgeInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): OrbisBridge {
    return new Contract(address, _abi, signerOrProvider) as OrbisBridge;
  }
}
