import express from "express";
const router = express.Router();

import { groupsController } from "../controllers";
import { auth, admin, decodeToken } from "../middlewares";

/**listing */
router.post("/v1/groups/room", [auth], groupsController.createNewChatRoom);
router.get("/v1/groups/room",[decodeToken], groupsController.getAllRoomChatGroup);

/** room memebers */
router.post("/v1/groups/room_members", [auth], groupsController.requestJoinGroup);

/** messages */
router.get("/v1/groups/group_messages/:groupId", [auth], groupsController.getGroupsMessages);

export default router;
