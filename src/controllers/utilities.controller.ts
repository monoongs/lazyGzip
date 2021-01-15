import { Request, Response } from "express";
import zlib from "zlib";
import logger from "../utilities/logger";

const Buffer = require("buffer").Buffer;

const makeGzipData = (req: Request, res: Response) => {
  try {
    logger.info(`Running on ${req.headers.host}${req.originalUrl}`);
    logger.debug(`Access into function: ${makeGzipData.name}`);

    if (!req.body) {
      return res.json({ data: "No Input" });
    }

    logger.silly(`Input => ${JSON.stringify(req.body)}`);

    const body = req.body;

    let bufferObject = new Buffer.from(JSON.stringify(body));
    let zipData = zlib.gzipSync(bufferObject).toString("base64");

    const result = {
      data: body,
      Gzip: zipData,
    };

    logger.silly(`Result => ${JSON.stringify(result)}`);

    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({
      error: error,
    });
  }
};

const destrucGzipData = (req: Request, res: Response) => {
  logger.info(`Running on ${req.headers.host}${req.originalUrl}`);
  logger.debug(`Access into function: ${makeGzipData.name}`);

  const body = req.body;

  const resUnzip = zlib.unzipSync(Buffer.from(body, "base64"));
  let rawData = JSON.parse(resUnzip.toString());

  return res.status(200).json({
    data: rawData,
  });
};

const utilitiesController = {
  makeGzipData: makeGzipData,
  destrucGzipData: destrucGzipData,
};

export default utilitiesController;
