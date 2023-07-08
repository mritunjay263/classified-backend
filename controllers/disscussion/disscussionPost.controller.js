
import Joi from "joi";
import {
  sequelize,
  discussion_questions as DisscussionQuestion,
  User as User,
  discussion_comments as DisscussionComments,
  disscusion_likes as DisscussionLikes,
  disscusion_views as DisscussionViews,
  tags as Tags,
  discussion_tags as DisscussionTags,
  Sequelize,
} from "../../models";
const { Op } = require("sequelize")
import { status as constStatus } from "../../const";
import { validationMessageHandler } from "../../services/utils/joi-validiation-helper";
import { ResponsePayload, errorHandler } from "../../middlewares";
import { CustomeErrorHandler } from "../../services";

const disscussionPostController = {
  /**create post disscustion */
  async createPost(req, res, next) {
    let postData = Joi.object()
      .keys({
        post_title: Joi.string().required(),
        // userId: Joi.string().uuid().required(),
        meta_title: Joi.string().required(),
        content: Joi.string().required(),
        location: Joi.string().required(),
        tags: Joi.array()
          .items(Joi.number())
          .required() /**tag must be array of number*/,
        status: Joi.string()
          .valid(...constStatus)
          .optional(),
      })
      .error((errors) => validationMessageHandler(errors));

    const { error } = postData.validate(req.body);
    if (error) {
      return next(error);
    }

    const {
      post_title,
      content,
      user_id = req.user.id,
      meta_title,
      location,
      tags,
      status,
    } = req.body;
    let postDataPayload = {
      post_title,
      user_id,
      meta_title,
      location,
      content,
      status,
    };
    postDataPayload = JSON.parse(JSON.stringify(postDataPayload));

    try {
      const postDataRes = await DisscussionQuestion.create(postDataPayload);
      //save all the tagsId in relationtion in discussion-tags Tabel
      for (let i = 0; i < tags.length; i++) {
        // const savedTagId = await saveAndReturnTagId(tags[i]);
        const payloadForRelationTabel = {
          post_id: postDataRes.id,
          tag_id: tags[i],
        };
        const relativeTagIdData = await saveTagIdAndDisId(
          payloadForRelationTabel
        );
      }

      let resPayload = new ResponsePayload(postDataRes);
      res.status(201).json(resPayload);
    } catch (error) {
      if (error.errors && error.errors[0].origin == "DB") {
        return next(error.errors[0]);
      }
      // console.log(error)
      return next(error);
    }
  },

  async getAllDissPost(req, res, next) {
    const {
      page = 1,
      limit = 5,
      searchKey,
      tags,
      sortBy, //views || likes
      status,
      order = "DESC",
      filterCountry,
    } = req.query;

    //order       ASC / DESC
    const userId = req.user ? req.user.id : null;
    //pagination
    const pageNumber = parseInt(page);
    const getRealNumber = isNaN(pageNumber) ? 0 : pageNumber;
    const usersOffset = limit * (getRealNumber - 1);

    try {
      const totalDissQuestion = await DisscussionQuestion.count({
        where: {
          ...(searchKey && {
            [Op.or]: [
              { post_title: { [Op.iLike]: `%${searchKey}%` } },
              { content: { [Op.iLike]: `%${searchKey}%` } },
              { meta_title: { [Op.iLike]: `%${searchKey}%` } },
            ],
          }),
          [Op.and]: [
            { ...(status && { status }) },
            { ...(filterCountry && { location: filterCountry }) },
          ],
        },
      });

      const dissQuestionData = await DisscussionQuestion.findAll({
        where: {
          [Op.and]: [
              {...(status && { status })},
              {...(filterCountry && { location: filterCountry })}
            ],
          ...(searchKey && {
            [Op.or]: [
              { post_title: { [Op.iLike]: `%${searchKey}%` } },
              { content: { [Op.iLike]: `%${searchKey}%` } },
              { meta_title: { [Op.iLike]: `%${searchKey}%` } },
            ],
            ...(filterCountry && { location: filterCountry }),
          }),
        },
        order: [["createdAt", order]],
        offset: usersOffset,
        limit,
        include: [
          {
            model: User,
            attributes: {
              exclude: ["password"],
            },
          },
          {
            model: DisscussionTags,
            include: [
              {
                model: Tags,
                attributes: ["tag"],
                as: "tags",
              },
            ],
            separate: true,
            as: "tags_on_post",
            attributes: ["tag_id"],
          },
        ],
        attributes: {
          include: [
            //disscussion comments Count Query
            getDiscussionCommentCount(),
            // Likes Count
            likeCountQuery(),
            // views Count
            viewsCountQuery(),
            //check if the post liked or not
            postLikedByUser(userId),
          ],
        },
        ...(sortBy == "likes" && {
          order: [[sequelize.literal('"totalPostLikes"'), "DESC"]],
        }),
        ...(sortBy == "views" && {
          order: [[sequelize.literal('"totalPostViews"'), "DESC"]],
        }),
      });

      const totalPages = Math.ceil(totalDissQuestion / limit);

      let resPayload = new ResponsePayload(
        {
          dissQuestionData: dissQuestionData || [],
          totalPages,
        },
        "",
        {
          length: dissQuestionData.length,
        }
      );
      return res.status(200).json(resPayload);
    } catch (err) {
      // console.log(err)
      return next(err);
    }
  },

  async getSinglePostByPk(req, res, next) {
    const paramId = req.params.id;
    const userId = req.user ? req.user.id : null;
    try {
      const singelPostDetails = await DisscussionQuestion.findOne({
        where: {
          id: paramId,
        },
        include: [
          {
            model: User,
            attributes: {
              exclude: ["password"],
            },
          },
          {
            model: DisscussionComments,
            where: {
              published: true,
            },
            separate: true,
            include: [
              {
                model: User,
                attributes: ["user_name"],
              },
            ],
            attributes: {
              include: [
                //get subCommnet Count
                subCommentCountQuery(),
                //subComment likes
                subCommentlikeCountQuery(),
              ],
            },
            order: [
              ["accepted_by_author", "DESC"],
              ["createdAt", "DESC"],
            ],
          },
          {
            model: DisscussionTags,
            include: [
              {
                model: Tags,
                attributes: ["tag"],
                as: "tags",
              },
            ],
            separate: true,
            as: "tags_on_post",
            attributes: ["tag_id"],
          },
        ],
        attributes: {
          include: [
            //disscussion comments Count Query
            getDiscussionCommentCount(),
            // Likes Count
            likeCountQuery(),
            // views Count
            viewsCountQuery(),
            //check if the post liked or not
            postLikedByUser(userId),
          ],
        },
      });
      let resPayload = new ResponsePayload(singelPostDetails);
      return res.status(200).json(resPayload);
    } catch (error) {
      if (error.errors && error.errors[0].origin == "DB") {
        return next(error.errors[0]);
      }
      return next(error);
    }
  },

  async updatePost(req,res,next){
    let postData = Joi.object()
      .keys({
        post_title: Joi.string().optional(),
        // userId: Joi.string().uuid().required(),
        meta_title: Joi.string().optional(),
        content: Joi.string().optional(),
        location: Joi.string().optional(),
        tags: Joi.array()
          .items(Joi.number())
          .optional() /**tag must be array of number*/,
        status: Joi.string()
          .valid(...constStatus)
          .optional(),
      })
      .error((errors) => validationMessageHandler(errors));

    const { error } = postData.validate(req.body);
    if (error) {
      return next(error);
    }

    const {
      post_title,
      content,
      meta_title,
      location,
      status,
    } = req.body;
    const { id } = req.params;

    let postDataPayload = {
      post_title,
      meta_title,
      location,
      content,
      status,
    };
    postDataPayload = JSON.parse(JSON.stringify(postDataPayload));

    try {
      let disscusionQuestion = await DisscussionQuestion.findByPk(id);

      if(!disscusionQuestion){
          return next(CustomeErrorHandler.serverError("Post not found!"));
      }
      
      disscusionQuestion = await disscusionQuestion.update(postDataPayload);
      let resPayload = new ResponsePayload(disscusionQuestion);
      res.status(201).json(resPayload);
    } catch (error) {
      if (error.errors && error.errors[0].origin == "DB") {
        return next(error.errors[0]);
      }
      // console.log(error)
      return next(error);
    }
  },

  /**comments and answer */
  async createPostComment(req, res, next) {
    let commentData = Joi.object()
      .keys({
        content: Joi.string().required(),
        parent_comment_id: Joi.number().optional(),
        post_id: Joi.number().optional(), //post question-id then dont send parent_comment_id
        // user_id: Joi.number().required(),
        published: Joi.boolean().optional(),
        tags: Joi.string().optional() /**tag must be in ,separted */,
      })
      .error((errors) => validationMessageHandler(errors));

    const { error } = commentData.validate(req.body);
    if (error) {
      return next(error);
    }
    const {
      content,
      parent_comment_id,
      post_id,
      published = true,
      user_id = req.user.id,
      tags,
    } = req.body;
    let commentDataPayload = {
      content,
      parent_comment_id,
      post_id,
      published,
      user_id,
      tags,
    };
    commentDataPayload = JSON.parse(JSON.stringify(commentDataPayload));

    try {
      const commentDataRes = await DisscussionComments.create(
        commentDataPayload
      );
      let resPayload = new ResponsePayload(commentDataRes);
      return res.status(201).json(resPayload);
    } catch (error) {
      if (error.errors && error.errors[0].origin == "DB") {
        return next(error.errors[0]);
      }
      return next(error);
    }
  },

  async getCommentsByParentCommentId(req, res, next) {
    try {
      const allParentComments = await DisscussionComments.findOne({
        where: {
          id: req.params.comment_id,
        },
        include: [
          {
            model: User,
            attributes: ["name","user_name", "email", "avatar", "createdAt", "updatedAt"],
          },
          {
            model: DisscussionComments,
            as: "child_comments",
            where: {
              published: true,
            },
            include: [
              {
                model: User,
                attributes: [
                  "name",
                  "user_name",
                  "email",
                  "avatar",
                  "createdAt",
                  "updatedAt",
                ],
              },
            ],
            order: [["createdAt", "DESC"]],
            separate: true,
            attributes: {
              include: [
                // Likes Count
                subCommentChildlikeCountQuery(),
              ],
            },
          },
        ],
        attributes: {
          include: [
            //disscussion sub-comments Count Query
            subCommentCountQuery(),
            // Likes Count
            subCommentlikeCountQuery(),
          ],
        },
      });
      let resPayload = new ResponsePayload(allParentComments);
      return res.status(200).json(resPayload);
    } catch (error) {
      if (error.errors && error.errors[0].origin == "DB") {
        return next(error.errors[0]);
      }
      return next(error);
    }
  },

  /**likes for post and comment both */
  async createPostCommentLike(req, res, next) {
    let postData = Joi.object()
      .keys({
        // user_id: Joi.string().uuid().required(),
        post_id: Joi.number().optional(),
        comment_id: Joi.number().optional(),
      })
      .error((errors) => validationMessageHandler(errors));

    const { error } = postData.validate(req.body);
    if (error) {
      return next(error);
    }

    const { user_id = req.user.id, post_id, comment_id } = req.body;
    let postDataPayload = {
      user_id,
      post_id,
      comment_id,
    };
    postDataPayload = JSON.parse(JSON.stringify(postDataPayload));
    // console.log(postDataPayload);
    if (
      (!postDataPayload.post_id && !postDataPayload.comment_id) ||
      (postDataPayload.post_id && postDataPayload.comment_id)
    ) {
      return next(CustomeErrorHandler.badRequest());
    }

    try {
      //post_id validation
      if (postDataPayload.post_id) {
        const likesForThisPost = await DisscussionLikes.count({
          where: {
            post_id: postDataPayload.post_id,
            user_id: postDataPayload.user_id,
          },
        });
        if (likesForThisPost > 0) {
          //disLike post action
          const disLikeData = await DisscussionLikes.destroy({
            where: {
              post_id: postDataPayload.post_id,
              user_id: postDataPayload.user_id,
            },
          });
          if (disLikeData != 1) {
            return next(CustomeErrorHandler.serverError("Action Failed !"));
          }
          let resPayload = new ResponsePayload({
            msg: "liked remove sucessfully !",
          });
          return res.status(200).json(resPayload);
          // return next(
          //   CustomeErrorHandler.badRequest("Bad request, already exist !")
          // );
        }
      }
      //comment_id validation
      if (postDataPayload.comment_id) {
        const likesForThisPost = await DisscussionLikes.count({
          where: {
            comment_id: postDataPayload.comment_id,
            user_id: postDataPayload.user_id,
          },
        });
        if (likesForThisPost > 0) {
          //disLike comment
          const disLikeData = await DisscussionLikes.destroy({
            where: {
              comment_id: postDataPayload.comment_id,
              user_id: postDataPayload.user_id,
            },
          });
          // console.log(disLikeData);
          if (disLikeData != 1) {
            return next(CustomeErrorHandler.serverError("Action Failed !"));
          }
          let resPayload = new ResponsePayload({
            msg: "liked remove sucessfully !",
          });
          return res.status(200).json(resPayload);
          // return next(
          //   CustomeErrorHandler.badRequest("Bad request, already exist !")
          // );
        }
      }
      //finaly like the post or comment
      const likesDataRes = await DisscussionLikes.create(postDataPayload);
      let resPayload = new ResponsePayload(likesDataRes);
      return res.status(201).json(resPayload);
    } catch (error) {
      // console.log(error)
      if (error.errors && error.errors[0].origin == "DB") {
        return next(error.errors[0]);
      }
      return next(error);
    }
  },

  /** mark as accepted answer */
  async markAsAcceptedAnswerByAuthor(req,res,next){
      let postData = Joi.object()
        .keys({
          post_id: Joi.number().required(),
          answer_id: Joi.number().required(),
        })
        .error((errors) => validationMessageHandler(errors));

        const { error } = postData.validate(req.body);
        if (error) {
          return next(error);
        }
      const {
        user_id = req.user.id,
        post_id,
        answer_id,
      } = req.body;
     
      /** check the action created by real author of the post */
      try {
        const realAuthorOfPost =await DisscussionQuestion.findOne({where: {id:post_id,user_id}});


        if (!realAuthorOfPost){
           return next(CustomeErrorHandler.badRequest());
        }

        /** check if already accepted answer for this post exist */
        const allreadyAcceptedAnswer = await DisscussionComments.findOne({
          where: {
            post_id,
            accepted_by_author: true,
          },
        });
        // console.log(allreadyAcceptedAnswer);
        /**, if yes than update to false  */
        if (allreadyAcceptedAnswer) {
          const allreadyAcceptedData = await DisscussionComments.update(
            { accepted_by_author: false},
             { where: { id: allreadyAcceptedAnswer.id} }
          );
        }

        /** mark as accepted answer for this post */
          const markAsAccepted =await DisscussionComments.update(
            { accepted_by_author: true,},
             { where: {  id: answer_id} }
            );
          // console.log(markAsAccepted);
          let resPayload = new ResponsePayload({"msg":"mark as accepted !"});
          return res.status(201).json(resPayload);

      } catch (error) {
        if (error.errors && error.errors[0].origin == "DB") {
          return next(error.errors[0]);
        }
        return next(error);
      }

  },

  /**likes */
  async createPostViews(req, res, next) {
    let postData = Joi.object()
      .keys({
        post_id: Joi.number().required(),
      })
      .error((errors) => validationMessageHandler(errors));

    const { error } = postData.validate(req.body);
    if (error) {
      return next(error);
    }

    try {
      const viewDataRes = await DisscussionViews.create({
        post_id: req.body.post_id,
      });
      let resPayload = new ResponsePayload(viewDataRes);
      return res.status(201).json(resPayload);
    } catch (error) {
      if (error.errors && error.errors[0].origin == "DB") {
        return next(error.errors[0]);
      }
      return next(error);
    }
  },

  /** create tags  */
  async createTag(req, res, next) {
    let tagData = Joi.object()
      .keys({
        tag: Joi.string().required(),
      })
      .error((errors) => validationMessageHandler(errors));

    const { error } = tagData.validate(req.body);
    if (error) {
      return next(error);
    }
    try {
      await Tags.findOne({ where: { tag: req.body.tag } }).then(
        async (data) => {
          if (!data) {
            const tagDataRes = await Tags.create({
              tag: req.body.tag,
            });
            let resPayload = new ResponsePayload(tagDataRes);
            return res.status(201).json(resPayload);
          }
          return next(
            CustomeErrorHandler.alreadyExist("data is already exist !")
          );
        }
      );
    } catch (error) {
      if (error.errors && error.errors[0].origin == "DB") {
        return next(error.errors[0]);
      }
      return next(error);
    }
  },

  /** search tag */
  async searchTag(req,res,next){
     const {
      tag,
      limit=10
     } = req.query;

     try {
      const tagsData = await Tags.findAll({
        where: { tag: { [Op.iLike]: `%${tag}%` } },
        // order: [["createdAt", "DESC"]],
        limit,
      });
      let resPayload = new ResponsePayload(tagsData);
      return res.status(200).json(resPayload);

     } catch (error) {
       if (error.errors && error.errors[0].origin == "DB") {
         return next(error.errors[0]);
       }
       return next(error);
     }
  },

  /** trending tags */ 
  async getTrendingTags(req,res,next) {
    const {limit = 5 } = req.query;

    try {
      const tagsData = await DisscussionTags.findAll({
        include: [
          {
            model: Tags,
            // attributes: ["tag"],
            as: "tags",
          },
        ],
        attributes: [
          [sequelize.fn("COUNT", Sequelize.col("tag_id")), "count"],
          "tag_id",
        ],
        group: ["discussion_tags.tag_id", "tags.id"],
        limit,
        order: [[sequelize.literal("count DESC")]],
      });

      let resPayload = new ResponsePayload(tagsData);
      resPayload.count = tagsData.length;
      return res.status(200).json(resPayload);
    } catch (error) {
      if (error.errors && error.errors[0].origin == "DB") {
        return next(error.errors[0]);
      }
      return next(error);
    }
  },

  /** trending tags */ 
  async getTrendingCountryDiscusstion(req,res,next) {
    const {limit = 10} = req.query;

    try {
      const locationData = await DisscussionQuestion.findAll({
        attributes: [
          [sequelize.fn("COUNT", Sequelize.col("location")), "count"],
          "location",
        ],
        group: ["location"],
        limit,
        order: [[sequelize.literal("count DESC")]],
      });

      let resPayload = new ResponsePayload(locationData);
      resPayload.count = locationData.length;
      return res.status(200).json(resPayload);
    } catch (error) {
      if (error.errors && error.errors[0].origin == "DB") {
        return next(error.errors[0]);
      }
      return next(error);
    }
  }

};


function getDiscussionCommentCount(){
  return [
                // Note the wrapping parentheses in the call below!
                sequelize.literal(`(
                    SELECT COUNT(*)
                    FROM discussion_comments AS dc
                    WHERE
                        dc.post_id = discussion_questions.id
                )`),
                "totalPostComments",
         ]
}

function likeCountQuery(){
  return [
    // Likes
    sequelize.literal(`(
                    SELECT COUNT(*)
                    FROM disscusion_likes AS dl
                    WHERE
                        dl.post_id = discussion_questions.id
                )`),
    "totalPostLikes",
  ];
}

function viewsCountQuery() {
  return [
    // Likes
    sequelize.literal(`(
                    SELECT COUNT(*)
                    FROM disscusion_views AS dv
                    WHERE
                        dv.post_id = discussion_questions.id
                )`),
    "totalPostViews",
  ];
}

function subCommentCountQuery(){
  return [
    // Likes
    sequelize.literal(`(
                    SELECT COUNT(*)
                    FROM discussion_comments AS dc
                    WHERE
                        dc.parent_comment_id = discussion_comments.id
                )`),
    "totalChildComments",
  ];
}

function subCommentlikeCountQuery() {
  return [
    // Likes
    sequelize.literal(`(
                    SELECT COUNT(*)
                    FROM disscusion_likes AS dl
                    WHERE
                        dl.comment_id = discussion_comments.id
                )`),
    "totalLikes",
  ];
}
function subCommentChildlikeCountQuery() {
  return [
    // Likes
    sequelize.literal(`(
                    SELECT COUNT(*)
                    FROM disscusion_likes AS dl
                    WHERE
                        dl.comment_id = discussion_comments.id
                )`),
    "totalLikes",
  ];
}

function postLikedByUser(userId) {
  if (!userId){
    return [
      //return false
      sequelize.literal(`(
                    SELECT Count(*) from disscusion_likes where 1=2
                )`),
      "likedStatus",
    ];
  }
  else{
    return [
      // Likes
      sequelize.literal(`(
                    SELECT count(*) FROM disscusion_likes AS dl
                    where dl.user_id ='${userId}'
                    and dl.post_id= discussion_questions.id
                )`),
      "likedStatus",
    ];
  }
}

async function saveAndReturnTagId(tag){
    const tagsData = await Tags.create({ tag });
    return tagsData.id;
};

async function saveTagIdAndDisId(payloadData){
  const response = await DisscussionTags.create(payloadData);
  return response;
}

export default disscussionPostController;