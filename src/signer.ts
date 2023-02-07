import { createJsonRpcServer, forceObject } from "grindery-nexus-common-utils";
import { ethGetAddress, ethSignTransaction, ethSignMessage, ethSignTypedData } from "./eth";
import { flowGetPayerAddress, flowGetPublicKey, flowSignTransaction } from "./flow";

export default function buildJsonRpcServer() {
  const server = createJsonRpcServer();
  const methods = {
    ethGetAddress,
    ethSignTransaction,
    ethSignMessage,
    ethSignTypedData,

    flowGetPublicKey,
    flowGetPayerAddress,
    flowSignTransaction,
  };
  for (const [name, func] of Object.entries(methods)) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    server.addMethod(name, forceObject(func as any));
  }
  return server;
}
