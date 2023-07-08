import express from "express";
const router = express.Router();

import {
  CategoryController,
  subCategoryController,
} from "../controllers";
import { auth, admin } from "../middlewares";

/**Categories */
router.get("/v1/categories", CategoryController.getAll);
router.get("/v1/categories/:categoryId", CategoryController.getSingleCategory);
router.post("/v1/categories" , CategoryController.createCategory);
router.delete("/v1/categories/:categoryId", CategoryController.deleteCategory);

/** category custome field */
router.get("/v1/subCategories/fields", subCategoryController.getOnlyFieldsName);
router.get("/v1/category/customefield",subCategoryController.getAllCustomeField); //get all Custome Field && (?customeFieldId=3   for singel get)
router.post("/v1/category/customefield",subCategoryController.createCustomeField); //subCategory Custome Field
router.delete("/v1/category/customefield/:fieldId",subCategoryController.delteCustomeField); //subCategory Custome Field
router.patch("/v1/category/customefield/:fieldId", subCategoryController.changeCustomeFieldData);

/** subCategory */
router.get("/v1/subCategories", subCategoryController.getAllSubCategory);//?id=1 (for get by query param)
router.post("/v1/subCategories", subCategoryController.createSubCategory); 
router.delete("/v1/subCategories/:subCategoryId", subCategoryController.deleteSubCategory); //subCategoryId=1 


export default router;

