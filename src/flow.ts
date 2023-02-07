import { GcpKmsAuthorizer, IAuthorize } from "fcl-gcp-kms-authorizer";
import { encodeMessageFromSignable } from "@onflow/sdk";

type Signature = {
  address: string;
  keyId: number;
  sig: string;
};

type Signable = {
  message: string; // The encoded string which needs to be used to produce the signature.
  addr: string; // The address of the Flow Account this signature is to be produced for.
  keyId: number; // The keyId of the key which is to be used to produce the signature.
  roles: {
    proposer?: boolean; // A Boolean representing if this signature to be produced for a proposer.
    authorizer?: boolean; // A Boolean representing if this signature to be produced for a authorizer.
    payer?: boolean; // A Boolean representing if this signature to be produced for a payer.
  };
  voucher: {
    cadence: string;
    refBlock: unknown | null;
    computeLimit: unknown;
    arguments: unknown[];
    proposalKey: {
      address: string;
      keyId: number;
      sequenceNum: unknown;
    };
    payer: string;
    authorizers: string[];
    payloadSigs: Signature[];
    envelopeSigs: Signature[];
  };
};

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
const payerAuthorizer = new GcpKmsAuthorizer(process.env.FLOW_PAYER_KEY_PATH!);

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
const userAuthorizer = new GcpKmsAuthorizer(process.env.FLOW_USER_KEY_PATH!);

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
const FLOW_PAYER_ADDRESS = process.env.FLOW_PAYER_ADDRESS!;

function sansPrefix(addr: string) {
  return addr.toLowerCase().replace(/^0x/i, "");
}

export async function flowGetPublicKey() {
  return await userAuthorizer.getPublicKey();
}

export async function flowGetPayerAddress() {
  return FLOW_PAYER_ADDRESS;
}

export async function flowSignTransaction({ signable }: { signable: Signable }) {
  if (encodeMessageFromSignable(signable, signable.addr) !== signable.message) {
    throw new Error("Invalid transaction message");
  }
  let auth: IAuthorize;
  if (sansPrefix(signable.addr) === sansPrefix(FLOW_PAYER_ADDRESS)) {
    if (signable.roles.authorizer || signable.roles.proposer || !signable.roles.payer) {
      throw new Error("Unsupported role for payer address");
    }
    auth = await payerAuthorizer.authorize(signable.addr, signable.keyId)({});
  } else {
    auth = await userAuthorizer.authorize(signable.addr, signable.keyId)({});
  }
  return await auth.signingFunction(signable);
}
