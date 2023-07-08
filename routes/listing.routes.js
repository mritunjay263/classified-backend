import express from "express";
const router = express.Router();

import {
  listingController,
} from "../controllers";
import { auth, admin } from "../middlewares";

/**listing */
router.get("/v1/listings", listingController.getListing);
router.get("/v1/listings/my-listings", [auth], listingController.getMyListing);
router.post("/v1/listings",[auth], listingController.createListing);
router.get("/v1/listings/:listingId", listingController.getListingById);
router.patch("/v1/listings/:listingId", listingController.updateListing);
router.delete("/v1/listings/:listingId", listingController.deleteListingById); //subCategoryId=1 

export default router;
