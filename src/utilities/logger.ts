import { createLogger, format, transports } from "winston";

// * Level "info" for look overview
// * Level "debug" for debuging ( see only what function it calls )
// * Level "silly" for see functions name and others etc.

const fs = require("fs");
const path = require("path");
const logDir = "log";

if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir);
}

const filename = path.join(logDir, "results.log");

const logger = createLogger({
  // level: "info",
  // level: "debug",
  level: "silly",
  format: format.combine(
    format.colorize(),
    format.timestamp({
      format: "YYYY-MM-DD HH:mm:ss",
    }),
    format.printf((info) => `${info.timestamp} ${info.level}: ${info.message}`)
  ),
  transports: [new transports.Console()],
  // transports: [
  //   new transports.Console({
  //     level: "info",
  //     format: format.combine(
  //       format.colorize(),
  //       format.printf(
  //         (info) => `${info.timestamp} ${info.level}: ${info.message}`
  //       )
  //     ),
  //   }),
  //   new transports.File({ filename }),
  // ],
});

export default logger;
