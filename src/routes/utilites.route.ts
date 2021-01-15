import express from "express";

import utilitiesController from "../controllers/utilities.controller";

const router = express.Router();

// * api/${version}/utilities

router.post("/make", utilitiesController.makeGzipData);
router.post("/unzip", utilitiesController.destrucGzipData);

export default router;
