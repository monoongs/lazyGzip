import { Request, Response } from "express";
import zlib from "zlib";
import logger from "../utilities/logger";
import axios from "axios";

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
  logger.debug(`Access into function: ${destrucGzipData.name}`);

  if (!req.body || req.body === {}) {
    return res.status(200).json({});
    // return res.status(400).json({ data: "data" });
  }

  const body = req.body;

  const resUnzip = zlib.unzipSync(Buffer.from(body, "base64"));
  let rawData = JSON.parse(resUnzip.toString());

  return res.status(200).json({
    data: rawData,
    Gzip: req.body,
  });
};

async function fetchData(services: any) {
  try {
    // console.log("chec,", services);
    const response = await axios.get(`${services.url}/healthcheck`);

    return {
      serviceName: services.name,
      uri: services.url,
      status: true,
      data: response.data,
    };
  } catch (error) {
    return {
      serviceName: services.name,
      uri: services.url,
      status: false,
      data: error.message,
    };
  }
}

function getAllData(services: any) {
  return Promise.all(services.map(fetchData));
}

const healthCheck = async (req: Request, res: Response) => {
  try {
    const services: any = JSON.parse(`${process.env.SERVICES}`);

    let result: any = undefined;

    await getAllData(services)
      .then((resp) => {
        result = resp;
        // console.log(resp);
      })
      .catch((e) => {
        // console.log(e);
      });

    return res.status(200).json({
      data: result,
    });
  } catch {}
};

const utilitiesController = {
  makeGzipData,
  destrucGzipData,
  healthCheck,
};

export default utilitiesController;
