import Joi from "joi";
import {
  sequelize,
  chat_rooms as ChatRooms,
  chat_room_tags as ChatRoomTags,
  User as User,
  tags as Tags,
  Sequelize,
  room_members as RoomMembers,
  chat_messages as ChatMessages,
} from "../../models";
const { Op } = require("sequelize");
import { status as constStatus, roomType} from "../../const";
import { validationMessageHandler } from "../../services/utils/joi-validiation-helper";
import { ResponsePayload, errorHandler } from "../../middlewares";
import { CustomeErrorHandler } from "../../services";


const groupsController={

    async createNewChatRoom(req,res,next){
        let postData = Joi.object()
            .keys({
            room_name: Joi.string().required(),
            // userId: Joi.string().uuid().required(),
            room_type: Joi.string().valid(...roomType).required(),
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
          room_name,
          room_type,
          user_id = req.user.id,
          location,
          tags,
          status,
        } = req.body;
        let postDataPayload = {
          room_name,
          room_type,
          user_id,
          location,
          tags,
          status,
        };
        postDataPayload = JSON.parse(JSON.stringify(postDataPayload));

        try {
        const postDataRes = await ChatRooms.create(postDataPayload);
        //save all the tagsId in relationtion in chatRoom-tags Tabel
        for (let i = 0; i < tags.length; i++) {
            // const savedTagId = await saveAndReturnTagId(tags[i]);
            const payloadForRelationTabel = {
              room_id: postDataRes.id,
              tag_id: tags[i],
            };
            const relativeTagIdData = await saveTagIdAndRoomId(payloadForRelationTabel);
        }

        let resPayload = new ResponsePayload(postDataRes);
        res.status(201).json(resPayload);
        } catch (error) {
        if (error.errors && error.errors[0].origin == "DB") {
            return next(CustomeErrorHandler.serverError(error.errors[0].message));
        }
        return next(error);
        }
    },

    async getAllRoomChatGroup(req,res,next){
      const {
        page = 1,
        limit = 10,
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
      const currentOffset = limit * (getRealNumber - 1);

      try{
        const totalChatRoomsCount = await ChatRooms.count({
          where: {
            [Op.and]: [{ ...(status && { status }) }],
          },
        });
        const totalChatRooms = await ChatRooms.findAll({
          where: {
            [Op.and]: [{ ...(status && { status }) }],
          },
          include: [
            {
              model: User,
              attributes: {
                exclude: ["password"],
              },
            },
            {
              model: ChatRoomTags,
              include: [
                {
                  model: Tags,
                  attributes: ["tag"],
                  as: "tags",
                },
              ],
              as: "tags_on_chat_room",
              attributes: ["tag_id"],
            },
            // ...(userId ? [ {
            //     //only see the authenticated user deatials
            //     model: RoomMembers,
            //     where: {
            //       user_id: userId,
            //     },
            //     as: "chat_room_members" }]
            // : [])
          ],
          order: [["createdAt", order]],
          offset: currentOffset,
          limit,
          attributes: {
            include: [
             ...(userId ? [roomMemberStatus(userId)] : [])
            ],
          },
        });
        const totalPages = Math.ceil(totalChatRoomsCount / limit);
        let resPayload = new ResponsePayload(
          {
            totalChatRooms: totalChatRooms || [],
            totalChatRoomsCount,
            totalPages,
            limit,
            currentOffset,
          },
          "",
          {
            length: totalChatRooms.length,
          }
        );
        return res.status(200).json(resPayload);
      }catch(err){
      return next(err);
      }
    },

    async requestJoinGroup(req,res,next){
      let reqMembersData = Joi.object()
        .keys({
          room_id: Joi.string().uuid().required(),
          // userId: Joi.string().uuid().required(),
          status: Joi.string()
            .valid(...constStatus)
            .optional(),
        })
        .error((errors) => validationMessageHandler(errors));

      const { error } = reqMembersData.validate(req.body);
      if (error) {
        return next(error);
      }

      const {
        room_id,
        user_id = req.user.id,
        status,
      } = req.body;
      let postDataPayload = {
        room_id,
        user_id,
        status,
      };
      postDataPayload = JSON.parse(JSON.stringify(postDataPayload));

      try {
        const postDataRes = await RoomMembers.create(postDataPayload);
        let resPayload = new ResponsePayload(postDataRes);
        res.status(201).json(resPayload);
      } catch (error) {
        if (error.errors && error.errors[0].origin == "DB") {
          return next(CustomeErrorHandler.serverError(error.errors[0].message));
        }
        return next(error);
      }
    },

    async getGroupsMessages(req,res,next){
      const { groupId } =req.params;
      const { page = 1, limit = 20, sortBy, order = "ASC" } = req.query;

      //order       ASC / DESC
      const userId = req.user ? req.user.id : null;
      //pagination
      const pageNumber = parseInt(page);
      const getRealNumber = isNaN(pageNumber) ? 0 : pageNumber;
      const currentOffset = limit * (getRealNumber - 1);

      try {
        const totalChatMessagesCount = await ChatMessages.count({
          where: {
            [Op.and]: [{ ...(groupId && { room_id: groupId }) }],
          },
        });
        const chatRoomMessages = await ChatMessages.findAll({
          where: {
            [Op.and]: [{ ...(groupId && { room_id: groupId }) }],
          },
          include: [
            // {
            //   model: User,
            //   attributes: {
            //     exclude: ["password"],
            //   },
            // },
            // {
            //   model: ChatRoomTags,
            //   include: [
            //     {
            //       model: Tags,
            //       attributes: ["tag"],
            //       as: "tags",
            //     },
            //   ],
            //   as: "tags_on_chat_room",
            //   attributes: ["tag_id"],
            // },
            // ...(userId ? [ {
            //     //only see the authenticated user deatials
            //     model: RoomMembers,
            //     where: {
            //       user_id: userId,
            //     },
            //     as: "chat_room_members" }]
            // : [])
          ],
          order: [["createdAt", order]],
          offset: currentOffset,
          limit,
          // attributes: {
          //   include: [...(userId ? [roomMemberStatus(userId)] : [])],
          // },
        });
        const totalPages = Math.ceil(totalChatMessagesCount / limit);
        let resPayload = new ResponsePayload(
          {
            chatRoomMessages: chatRoomMessages || [],
            totalChatMessagesCount,
            totalPages,
            limit,
            currentOffset,
          },
          "",
          {
            length: chatRoomMessages.length,
          }
        );
        return res.status(200).json(resPayload);
      } catch (err) {
        console.log(err)
        return next(err);
      }
    }
};

async function saveTagIdAndRoomId(payloadData) {
  const response = await ChatRoomTags.create(payloadData);
  return response;
}

function roomMemberStatus(userId) {
  //  return [
  //    // Likes
  //    sequelize.literal(`(
  //                   SELECT CASE WHEN EXISTS (
  //                     SELECT * FROM room_members AS rm
  //                   where rm.user_id ='${userId}'
  //                   and rm.room_id= chat_rooms.id 
  //                   )  THEN true
  //                       ELSE false
  //                   END
  //               )`),
  //    "joinRoomStatus",
  //  ];  
   return [
     // Likes
     sequelize.literal(`(
                      SELECT status FROM room_members AS rm
                    where rm.user_id ='${userId}'
                    and rm.room_id= chat_rooms.id 
                )`),
     "joinRoomStatus",
   ];  
}

// SELECT CASE WHEN COUNT(*) > 0 THEN 'Joined' ELSE 'Not Joined' END FROM room_members AS rm


export default groupsController;