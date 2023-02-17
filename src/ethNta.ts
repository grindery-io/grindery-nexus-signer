import { ethers } from "ethers";
import { getEthSignerWithKeyPath } from "./eth";

// NTA = Non-transaction agent, this wallet is for signing message only and supports signing raw hash. Used for Gnosis Safe delegates, and possibly others.

function getEthSigner() {
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  return getEthSignerWithKeyPath(process.env.ETH_NTA_KEY_PATH!);
}

let ETH_ADDRESS = "";

export async function ethNtaGetAddress() {
  if (!ETH_ADDRESS) {
    const signer = getEthSigner();
    ETH_ADDRESS = ethers.utils.getAddress(await signer.getAddress());
  }
  return ETH_ADDRESS;
}

export async function ethNtaSignRawDataHash({ data }: { data: string }) {
  if (!data) {
    throw new Error("Missing data");
  }
  const dataArray = ethers.utils.arrayify(data);
  let isTx = false;
  try {
    ethers.utils.parseTransaction(dataArray);
    isTx = true;
  } catch (_) {
    // Ignore
  }
  if (isTx) {
    throw new Error("Signing transaction is not allowed");
  }
  const signer = getEthSigner();
  return await signer._signDigest(ethers.utils.keccak256(dataArray));
}

export async function ethNtaSignMessage({ message }: { message: string }) {
  if (!message) {
    throw new Error("Missing message");
  }
  const signer = getEthSigner();
  return await signer.signMessage(ethers.utils.arrayify(message));
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function ethNtaSignTypedData({ data, version }: { data: any; version: any }) {
  const signer = getEthSigner();
  return await signer.signTypedData({ data, version });
}
