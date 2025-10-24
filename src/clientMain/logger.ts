import { colors, Logger, LogLevel } from "@100x/engine/logging";

export const logger = new Logger("client", LogLevel.Info, colors.red);
