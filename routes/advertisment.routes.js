import express from "express";
const router = express.Router();
import { advertisementController } from "../controllers";
import { auth } from "../middlewares";

//list of country and city
router.get("/v1/list/country", advertisementController.getListOfCountry); // for single country pass
                                                                          // Query-Param = ?country_id=1;        

//advertisement Location
router.post("/v1/advertisement/location", advertisementController.createAddLocation);
router.get("/v1/advertisement/location", advertisementController.getAddLocations);  //? query param by [ page_name, location_name, id ]
router.delete("/v1/advertisement/location/:id", advertisementController.deleteAddLocation);
router.patch("/v1/advertisement/location/:id", advertisementController.updateAddLocation);

//advertisement Entity 
router.post("/v1/advertisement/entity", [auth], advertisementController.createAddEntity);
router.get("/v1/advertisement/entity", advertisementController.getAllAdvertisment);
router.get("/v1/advertisement/myentity", [auth], advertisementController.getMyAdvertisment);
router.delete("/v1/advertisement/entity/:id", advertisementController.deleteAddEntity);
router.patch("/v1/advertisement/entity/:id", advertisementController.updateAddEntity);

// ADD-CITY Price
router.post("/v1/advertisement/city_price",[auth], advertisementController.createAddCityPrice);
router.get("/v1/advertisement/city_price",[auth], advertisementController.getAllCityPrice);
router.get("/v1/advertisement/city_price/:city_name",[auth], advertisementController.getcityPriceByCityName);
router.patch("/v1/advertisement/city_price/:city_name",[auth], advertisementController.updateCityPrice);
router.delete("/v1/advertisement/city_price/:city_name",[auth], advertisementController.deleteCityPrice);

//price calculation
router.post("/v1/advertisement/price_calculate",[auth], advertisementController.cityAddPrice);

//s3 bucket image upload
router.get("/v1/s3test" , advertisementController.uplaodImageS3Bucket);



export default router;