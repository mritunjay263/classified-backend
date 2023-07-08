import {
  User,
  Role,
  Listing as Listing,
  chat_rooms as ChatRooms,
  discussion_questions as DisscussionQuestion,
  add_entity as addEntity,
} from "../../models";
import { CustomeErrorHandler } from "../../services";
import { ResponsePayload } from "../../middlewares";
import Joi from "joi";

const userController = {
  async allUsers(req, res, next) {
    const {
      page = 1,
      limit = 10,
      email,
      phoneNumber,
      status,
      order = "DESC",
    } = req.query;
    //order       ASC / DESC

    //pagination
    const pageNumber = parseInt(page);
    const getRealNumber = isNaN(pageNumber) ? 0 : pageNumber;
    const usersOffset = limit * (getRealNumber - 1);

    try {
      const totalUsers = await User.count({
        where: {
          ...(email && { email }),
          ...(phoneNumber && { phoneNumber }),
          ...(status && { status }),
        },
      });

      const users = await User.findAll({
        where: {
          ...(email && { email }),
          ...(phoneNumber && { phoneNumber }),
          ...(status && { status }),
        },
        order: [["createdAt", order]],
        offset: usersOffset,
        limit,
        include: [{ model: Role }],
        attributes: {
          exclude: ["password"],
        },
      });

      const totalPages = Math.ceil(totalUsers / limit);

      let resPayload = new ResponsePayload(
        { users: users || [], totalPages },
        "",
        {
          length: users.length,
        }
      );
      return res.status(200).json(resPayload);
    } catch (err) {
      return next(err);
    }
  },

  async me(req, res, next) {
    try {
      const user = await User.findByPk(req.user.id, {
        include: [
          { model: Role },
          {
            model: Listing,
            where: { status: "active" },
            limit: 5,
            order: [["createdAt", "DESC"]],
            attributes: [
              "id",
              "listingTitle",
              "keyword",
              "gallery",
              "email",
              "status",
            ],
          },
          {
            model: ChatRooms,
            where: { status: "active" },
            limit: 5,
            order: [["createdAt", "DESC"]],
            attributes: ["id", "room_name", "room_type", "location"],
          },
          {
            model: DisscussionQuestion,
            where: { status: "active" },
            limit: 5,
            order: [["createdAt", "DESC"]],
            attributes: ["id", "post_title", "location"],
          },
          {
            model: addEntity,
            where: { status: "active" },
            limit: 5,
            order: [["createdAt", "DESC"]],
            attributes: ["id", "listing_id", "add_entity"],
          },
        ],
        attributes: {
          exclude: ["password"],
        },
      });
      if (!user) {
        return next(CustomeErrorHandler.notFound());
      }
      let resPayload = new ResponsePayload(user);
      res.status(200).json(resPayload);
    } catch (err) {
      return next(err);
    }
  },

  async getUserDetailsById(req, res, next) {
    try {
      const user = await User.findByPk(req.params.id, {
        include: [
          {
            model: Role,
            attributes: ["id", "role"],
          },
          {
            model: Listing,
            where: { status: "active" },
            limit: 5,
            order: [["createdAt", "DESC"]],
            attributes: [
              "id",
              "listingTitle",
              "keyword",
              "gallery",
              "email",
              "status",
            ],
          },
          {
            model: ChatRooms,
            where: { status: "active" },
            limit: 5,
            order: [["createdAt", "DESC"]],
            attributes: ["id", "room_name", "room_type", "location"],
          },
          {
            model: DisscussionQuestion,
            where: { status: "active" },
            limit: 5,
            order: [["createdAt", "DESC"]],
            attributes: ["id", "post_title", "location"],
          },
          {
            model: addEntity,
            where: { status: "active" },
            limit: 5,
            order: [["createdAt", "DESC"]],
            attributes: ["id", "listing_id", "add_entity"],
          },
        ],
        attributes: {
          exclude: ["password", "phoneNumber"],
        },
      });
      if (!user) {
        return next(CustomeErrorHandler.notFound());
      }
      let resPayload = new ResponsePayload(user);
      res.status(200).json(resPayload);
    } catch (err) {
      return next(err);
    }
  },


  async updateUserData(req, res, next) {
    //data validation
    const valiDateSchma = Joi.object({
      name: Joi.string().min(3).max(30).optional(),
      email: Joi.string().email().optional(),
      status: Joi.string().valid("active", "pending", "deactive").optional(),
      avatar: Joi.string().optional(),
      phoneNumber: Joi.string().optional(),
      address: Joi.string().optional(),
      website: Joi.string().optional(),
      bio: Joi.string().optional(),
      fbUrl: Joi.string().optional(),
      twtUrl: Joi.string().optional(),
      linkUrl: Joi.string().optional(),
      insUrl: Joi.string().optional(),
      originCountry: Joi.string().optional(),
      originState: Joi.string().optional(),
      originCity: Joi.string().optional(),
      livingCountry: Joi.string().optional(),
      livingState: Joi.string().optional(),
      livingCity: Joi.string().optional(),
      motherTongue: Joi.string().optional(),
      roleId: Joi.number().optional(),
    });
    const { error } = valiDateSchma.validate(req.body);
    if (error) {
      return next(error);
    }
    const {
      name,
      email,
      status,
      roleId,
      avatar,
      phoneNumber,
      address,
      website,
      bio,
      fbUrl,
      twtUrl,
      linkUrl,
      insUrl,
      originCountry,
      originState,
      originCity,
      livingCountry,
      livingState,
      livingCity,
      motherTongue,
    } = req.body;
    let user = {
      name,
      email,
      status,
      roleId,
      avatar,
      phoneNumber,
      address,
      website,
      bio,
      fbUrl,
      twtUrl,
      linkUrl,
      insUrl,
      originCountry,
      originState,
      originCity,
      livingCountry,
      livingState,
      livingCity,
      motherTongue,
    };
    user = JSON.parse(JSON.stringify(user));
    try {
      const [updateUser] = await User.update(
        { ...user },
        { where: { id: req.params.id } }
      );
      if (updateUser != 1) {
        return next(
          CustomeErrorHandler.serverError("User entity update failed!")
        );
      }
      let resPayload = new ResponsePayload({
        msg: "user entity updated successfully  !",
      });
      res.status(200).json(resPayload);
    } catch (err) {
      return next(err);
    }
  },
};

export default userController;