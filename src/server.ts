import express from "express";
import * as bodyParser from "body-parser";
import * as dotenv from "dotenv";
import cors from "cors";
import cluster from "cluster";
import logger from "./utilities/logger";
import utilitiesRoute from "./routes/utilites.route";
const numCPUs = require("os").cpus().length;

if (cluster.isMaster) {
  logger.info(`Master ${process.pid} is running`);

  let env = process.env.NODE_ENV || "development";
  // * Fork workers
  for (let i = 0; i < (env == "production" ? numCPUs : 1); i++) {
    cluster.fork();
  }

  cluster.on("exit", (worker: any, code: any, signal: any) => {
    logger.info(`worker ${worker.process.pid} died`);
  });
} else {
  const app = express();

  app.use(cors());
  dotenv.config();

  // app.use(expressMiddleware());

  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(bodyParser.text({ type: "text/plain" }));
  app.use(bodyParser.json());
  app.use(bodyParser.raw());

  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));

  app.get("/healthCheck", (req, res) => {
    res.status(200).json({
      data: "OK",
    });
  });

  const version = 1;

  app.use(`/api/v${version}/utilities`, utilitiesRoute);

  app.listen(process.env.PORT, () => {
    logger.info(`Server running on ${process.env.PORT}`);
  });
}
