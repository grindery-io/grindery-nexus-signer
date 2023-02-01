import "dotenv/config";
import { cliMain } from "grindery-nexus-common-utils/dist/jsonrpc/local";
import buildJsonRpcServer from "./signer";

cliMain(buildJsonRpcServer())
  .then((result) => console.log(result))
  .catch((e) => console.error(e));
