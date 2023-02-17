import { BigNumber, ethers } from "ethers";
import { GcpKmsSigner } from "ethers-gcp-kms-signer";

export function getEthSignerWithKeyPath(keyPath: string) {
  const [, projectId, locationId, keyRingId, keyId, keyVersion] =
    /^\s*projects\/([^/]+?)\/locations\/([^/]+?)\/keyRings\/([^/]+?)\/cryptoKeys\/([^/]+?)\/cryptoKeyVersions\/([^/]+?)\s*$/.exec(
      keyPath
    ) as string[];
  const signer = new GcpKmsSigner({ projectId, locationId, keyRingId, keyId, keyVersion });
  return signer;
}

function getEthSigner() {
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  return getEthSignerWithKeyPath(process.env.ETH_KEY_PATH!);
}

let ETH_ADDRESS = "";

export async function ethGetAddress() {
  if (!ETH_ADDRESS) {
    const signer = getEthSigner();
    ETH_ADDRESS = ethers.utils.getAddress(await signer.getAddress());
  }
  return ETH_ADDRESS;
}

export async function ethSignTransaction({ transaction }: { transaction: ethers.providers.TransactionRequest }) {
  if (!transaction) {
    throw new Error("Missing transaction");
  }
  if (transaction.from) {
    const address = await ethGetAddress();
    if (transaction.from.toLowerCase() !== address.toLowerCase()) {
      throw new Error("Invalid from address");
    }
    delete transaction.from;
  }
  if (BigNumber.from(transaction.value || "0").gt(0)) {
    throw new Error("Transferring native token is not allowed");
  }
  if (!transaction.data) {
    throw new Error("Transaction data is required");
  }
  if (!transaction.chainId) {
    throw new Error("chainId is required");
  }
  if (!/^(0x)?(9aea33ba|d4be0a94)/i.test(transaction.data?.toString() || "")) {
    throw new Error("Transaction is not in whitelist");
  }
  const signer = getEthSigner();
  return await signer.signTransaction(transaction);
}

export async function ethSignMessage({ message }: { message: string }) {
  if (!message) {
    throw new Error("Missing message");
  }
  const signer = getEthSigner();
  return await signer.signMessage(ethers.utils.arrayify(message));
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function ethSignTypedData({ data, version }: { data: any; version: any }) {
  const signer = getEthSigner();
  return await signer.signTypedData({ data, version });
}
