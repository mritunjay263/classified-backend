import express from "express";
const router = express.Router();
import { disscussionPostController } from "../controllers";
import { auth, decodeToken } from "../middlewares";

/** discussion form post */
router.post("/v1/disscussion-post", [auth], disscussionPostController.createPost);
router.get("/v1/disscussion-post",[decodeToken], disscussionPostController.getAllDissPost);
router.get("/v1/disscussion-post/:id",[decodeToken], disscussionPostController.getSinglePostByPk);
router.patch("/v1/disscussion-post/:id",[auth], disscussionPostController.updatePost); //without tags


/**disscusion comments */
router.post("/v1/disscussion-comment", [auth], disscussionPostController.createPostComment);
router.get("/v1/disscussion-comment/:comment_id", disscussionPostController.getCommentsByParentCommentId); //get discussion subComments by parent_comment_id
router.post("/v1/disscussion-comment/accepted",[auth], disscussionPostController.markAsAcceptedAnswerByAuthor); //get discussion subComments by parent_comment_id


/**likes */
router.post("/v1/disscussion-post-like", [auth], disscussionPostController.createPostCommentLike);

/**views */
router.post("/v1/disscussion-post-views", disscussionPostController.createPostViews);

/** tags */
router.get("/v1/disscussion-tags", disscussionPostController.searchTag);
router.post("/v1/disscussion-tags", disscussionPostController.createTag);
router.get("/v1/disscussion-tags/trending",disscussionPostController.getTrendingTags);
router.get("/v1/disscussion-country/trending",disscussionPostController.getTrendingCountryDiscusstion);

export default router;