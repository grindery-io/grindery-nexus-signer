import "dotenv/config";
import { LoggerAdaptToConsole, LOG_LEVEL } from "console-log-json";
import { runJsonRpcServer } from "grindery-nexus-common-utils";
import buildJsonRpcServer from "./signer";

if (process.env.LOG_JSON) {
  LoggerAdaptToConsole({ logLevel: LOG_LEVEL.debug });
}
runJsonRpcServer(buildJsonRpcServer());
