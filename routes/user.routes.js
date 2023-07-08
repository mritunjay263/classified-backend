import express from "express";
const router = express.Router();

import {
  registerController,
  loginController,
  userController
} from "../controllers";
import { auth, admin } from "../middlewares";

router.post("/v1/auth/signup", registerController.register);
router.post("/v1/auth/login", loginController.login);
router.get("/v1/auth/account", [auth], userController.me);

/**Users */
router.get("/v1/users", userController.allUsers); //query params are there
router.get("/v1/users/:id", userController.getUserDetailsById);
router.patch("/v1/users/:id",[auth], userController.updateUserData);

export default router;
