import Joi, { number } from "joi";
import { status as listStatus, typeOfAdd } from "../../const";
import { ResponsePayload } from "../../middlewares";

import {
  add_location as addLocation,
  add_entity as addEntity,
  sequelize,
  User as User,
  add_city_price as AddCityPrice,
  add_city_map as AddCityMap,
  global_price as GlobalPrice,
} from "../../models";
const { Op } = require("sequelize");

import { validationMessageHandler } from "../../services/utils/joi-validiation-helper";
import { CustomeErrorHandler , generateUploadURL} from "../../services"
// const countryListJson = require(__dirname+"/../../const/county_state_list.json")["countries"];
const countryListJson = require(__dirname + "/../../const/countries.json");
const stateListJson = require(__dirname + "/../../const/states.json");

const advertisementController = {
  async createAddLocation(req, res, next) {
    const addLocationSchema = Joi.object({
      page_name: Joi.string().required(),
      location_name: Joi.string().required(),
      location_info: Joi.string().optional(),
      length: Joi.string().required(),
      height: Joi.string().required(),
      status: Joi.string().valid(...listStatus),
      price: Joi.number().required(),
    }).error((errors) => validationMessageHandler(errors));

    const { error } = addLocationSchema.validate(req.body);
    if (error) {
      return next(error);
    }

    const {
      page_name,
      location_name,
      location_info,
      length,
      height,
      status = listStatus[0],
      price,
    } = req.body;
    //request payload
    let addLocationPayload = {
      page_name,
      location_name,
      location_info,
      length,
      height,
      status,
      price,
    };

    addLocationPayload = JSON.parse(JSON.stringify(addLocationPayload));

    try {
      const data = await addLocation.create(addLocationPayload);

      let resPayload = new ResponsePayload(data);
      res.status(200).json(resPayload);
    } catch (error) {
      if (error.errors && error.errors[0].origin == "DB") {
        return next(error.errors[0]);
      }
      return next(error);
    }
  },

  async getAddLocations(req, res, next) {
    let {
      id,
      page_name,
      location_name,
      add_location_status, //'active'
      add_entity_status, //'active'
      start_date_time,
      end_date_time,
      current_date_time,
    } = req.query;

    //  if(!start_date_time && !end_date_time && !current_date_time){
    //   current_date_time = new Date();
    //  }

    try {
      const data = await addLocation.findAll({
        where: {
          ...(id && { id }),
          ...(page_name && { page_name }),
          ...(location_name && { location_name }),
          ...(add_location_status && { status: add_location_status }),
        },
        include: [
          {
            model: addEntity,
            separate: true,
            where: {
              ...(add_entity_status && { status: add_entity_status }),

              ...(start_date_time && {
                start_date_time: {
                  [Op.gte]: start_date_time,
                },
              }),
              ...(end_date_time && {
                end_date_time: {
                  [Op.lte]: end_date_time,
                },
              }),
              ...(current_date_time && {
                start_date_time: {
                  [Op.lte]: current_date_time,
                },
                end_date_time: {
                  [Op.gte]: current_date_time,
                },
              }),
            },
          },
        ],
      });
      let resPayload = new ResponsePayload(data, "", {
        length: data.length,
      });
      res.status(200).json(resPayload);
    } catch (error) {
      return next(error);
    }
  },

  async deleteAddLocation(req, res, next) {
    try {
      const addData = await addLocation.destroy({
        where: { id: req.params.id },
      });
      if (addData != 1) {
        return next(
          CustomeErrorHandler.serverError(
            "Advertisement Location delete failed !"
          )
        );
      }
      let resPayload = new ResponsePayload({
        msg: "Advertisement Location deleted succesfully !",
      });
      return res.status(200).json(resPayload);
    } catch (err) {
      return next(err);
    }
  },

  async updateAddLocation(req, res, next) {
    const addLocationSchema = Joi.object({
      page_name: Joi.string().optional(),
      location_name: Joi.string().optional(),
      location_info: Joi.string().optional(),
      length: Joi.string().optional(),
      height: Joi.string().optional(),
      status: Joi.string()
        .valid(...listStatus)
        .optional(),
      price: Joi.number().required(),
    }).error((errors) => validationMessageHandler(errors));

    const { error } = addLocationSchema.validate(req.body);
    if (error) {
      return next(error);
    }

    const {
      page_name,
      location_name,
      location_info,
      length,
      height,
      status,
      price,
    } = req.body;
    //request payload
    let addLocationPayload = {
      page_name,
      location_name,
      location_info,
      length,
      height,
      status,
      price,
    };

    addLocationPayload = JSON.parse(JSON.stringify(addLocationPayload));

    try {
      const [updatedField] = await addLocation.update(addLocationPayload, {
        where: { id: req.params.id },
      });

      if (updatedField != 1) {
        return next(
          CustomeErrorHandler.serverError(
            "Advertisement Location update failed !"
          )
        );
      }
      let resPayload = new ResponsePayload({
        msg: "Advertisement Location updated successfully !",
      });

      return res.status(200).json(resPayload);
    } catch (err) {
      if (error.errors && error.errors[0].origin == "DB") {
        return next(error.errors[0]);
      }
      return next(error);
    }
  },

  async createAddEntity(req, res, next) {
    const addEntitySchema = Joi.object({
      add_location_id: Joi.number().required(),
      user_id: Joi.string().optional(),
      listing_id: Joi.string().required(),
      type_of_add: Joi.string()
        .valid(...typeOfAdd)
        .required(),
      add_entity: Joi.string().required(),
      status: Joi.string().valid(...listStatus),
      start_date_time: Joi.date().required(),
      end_date_time: Joi.date().required(),
      use_in_weekly_email: Joi.boolean().required(),
      on_desktop_view: Joi.boolean().required(),
      on_mobile_view: Joi.boolean().required(),
      cities_names: Joi.array().items(Joi.string().required()).optional(),
      cal_price: Joi.number().required(),
    }).error((errors) => validationMessageHandler(errors));

    const { error } = addEntitySchema.validate(req.body);
    if (error) {
      return next(error);
    }

    const {
      add_location_id,
      user_id,
      listing_id,
      type_of_add,
      add_entity,
      status = listStatus[1],
      start_date_time,
      end_date_time,
      use_in_weekly_email,
      on_desktop_view,
      on_mobile_view,
      cities_names,
      cal_price,
    } = req.body;
    //request payload

    const addLocationEntityPayload = {
      add_location_id,
      user_id,
      listing_id,
      type_of_add,
      add_entity,
      status,
      start_date_time,
      end_date_time,
      use_in_weekly_email,
      on_desktop_view,
      on_mobile_view,
      cal_price,
    };
    //user_id validiation
    if (!addLocationEntityPayload.user_id && req.user && req.user.id) {
      addLocationEntityPayload.user_id = req.user.id;
    }
    if (!addLocationEntityPayload.user_id) {
      return next(CustomeErrorHandler.badRequest());
    }

    try {
      const data = await addEntity.create(addLocationEntityPayload);
      let addCityDataArr = cities_names.map((d) => {
        return {
          add_id: data.id,
          city_name: d,
        };
      });
      //also save the selected cities in add_city table
      try {
        const metaData = await AddCityMap.bulkCreate(addCityDataArr);
      } catch (err) {
        //delete the created addEntity if error
        await addEntity.destroy({
          where: { id: data.id },
        });
        //return the error
        return next(err);
      }

      let resPayload = new ResponsePayload(data);
      res.status(200).json(resPayload);
    } catch (error) {
      // console.log(error);
      if (error.errors && error.errors[0].origin == "DB") {
        return next(error.errors[0]);
      }
      return next(error);
    }
  },

  async getAllAdvertisment(req, res, next) {
    const {
      id,
      add_location_id,
      user_id,
      listing_id,
      type_of_add,
      status,
      use_in_weekly_email,
      start_date_time, //impo
      end_date_time, //impo
      page = 1,
      limit = 10,
      order = "DESC", //ASC
      city_name
    } = req.query;

    const pageNumber = parseInt(page);
    const getRealNumber = isNaN(pageNumber) ? 0 : pageNumber;
    const postsOffset = limit * (getRealNumber - 1);

    try {
      const count = await addEntity.count({
        where: {
          ...(id && { id }),
          ...(add_location_id && { add_location_id }),
          ...(listing_id && { listing_id }),
          ...(user_id && { user_id }),
          ...(type_of_add && { type_of_add }),
          ...(status && { status }),
          ...(use_in_weekly_email && { use_in_weekly_email }),
        },
      });

      const totalAdvertise = await addEntity.findAll({
        where: {
          ...(id && { id }),
          ...(add_location_id && { add_location_id }),
          ...(listing_id && { listing_id }),
          ...(user_id && { user_id }),
          ...(type_of_add && { type_of_add }),
          ...(status && { status }),
          ...(use_in_weekly_email && { use_in_weekly_email }),
        },
        include: [
          {
            model: addLocation,
          },
          {
            model: User,
            attributes: ["id", "name", "user_name", "email"],
          },
          {
            model: AddCityMap,
            where: {
              ...(city_name && {city_name}),
            },
            attributes: ["id", "city_name", "createdAt", "updatedAt"],
          },
        ],
        order: [["createdAt", order]],
        offset: postsOffset,
        limit,
      });

      const totalPages = Math.ceil(count / limit);

      let resPayload = new ResponsePayload({
        totalAdvertise,
        totalPages,
        page,
        limit,
      });
      res.status(200).json(resPayload);
    } catch (error) {
      return next(error);
    }
  },

  async getMyAdvertisment(req, res, next) {
    const { page = 1, limit = 6, status = "active" } = req.query;
    const { id } = req.user;

    const pageNumber = parseInt(page);
    const getRealNumber = isNaN(pageNumber) ? 0 : pageNumber;
    const postsOffset = limit * (getRealNumber - 1);

    try {
      let totalAdvertise = 0;
      let advertisement = [];
      let activeAdvertisement = 0;
      let pendingAdvertisement = 0;

      activeAdvertisement = await addEntity.count({
        where: {
          status: "active",
          user_id: id,
        },
      });

      pendingAdvertisement = await addEntity.count({
        where: {
          status: "pending",
          user_id: id,
        },
      });

      totalAdvertise = await addEntity.count({
        where: {
          status: status,
          user_id: id,
        },
        order: [["createdAt", "DESC"]],
        offset: postsOffset,
        limit,
      });

      advertisement = await addEntity.findAll({
        where: {
          user_id: id,
          status: status,
        },
        include: [
          {
            model: addLocation,
          },
          {
            model: AddCityMap,
            attributes: ["id", "city_name", "createdAt", "updatedAt"],
          },
        ],
        order: [["createdAt", "DESC"]],
        offset: postsOffset,
        limit,
      });

      const totalPages = Math.ceil(totalAdvertise / limit);

      let resPayload = new ResponsePayload({
        advertisement,
        totalPages,
        activeAdvertisement,
        pendingAdvertisement,
      });
      res.status(200).json(resPayload);
    } catch (err) {
      return next(err);
    }
  },

  async deleteAddEntity(req, res, next) {
    try {
      const addEntityData = await addEntity.findByPk(req.params.id);

      if (!addEntityData) {
        return next(
          CustomeErrorHandler.serverError("Advertisement Entity not found !")
        );
      }

      const updatedAddEntity = await addEntityData.destroy();

      let resPayload = new ResponsePayload({
        msg: "Advertisement Entity deleted succesfully !",
      });

      return res.status(200).json(resPayload);
    } catch (error) {
      if (error.errors && error.errors[0].origin == "DB") {
        return next(error.errors[0]);
      }
      return next(error);
    }
  },

  async updateAddEntity(req, res, next) {
    const addEntitySchema = Joi.object({
      add_location_id: Joi.number().optional(),
      //  user_id: Joi.string().optional(), //dont update userd_id, since we know who create this entity
      listing_id: Joi.string().optional(),
      type_of_add: Joi.string()
        .valid(...typeOfAdd)
        .optional(),
      add_entity: Joi.string().optional(),
      status: Joi.string().valid(...listStatus),
      start_date_time: Joi.date().optional(),
      end_date_time: Joi.date().optional(),
      use_in_weekly_email: Joi.boolean().optional(),
      on_desktop_view: Joi.boolean().optional(),
      on_mobile_view: Joi.boolean().optional(),
      cal_price: Joi.number().optional(),
    }).error((errors) => validationMessageHandler(errors));

    const { error } = addEntitySchema.validate(req.body);
    if (error) {
      return next(error);
    }

    const {
      add_location_id,
      listing_id,
      type_of_add,
      add_entity,
      status,
      start_date_time,
      end_date_time,
      use_in_weekly_email,
      on_desktop_view,
      on_mobile_view,
      cal_price,
    } = req.body;
    //request payload
    let addLocationEntityPayload = {
      add_location_id,
      listing_id,
      type_of_add,
      add_entity,
      status,
      start_date_time,
      end_date_time,
      use_in_weekly_email,
      on_desktop_view,
      on_mobile_view,
      cal_price,
    };

    addLocationEntityPayload = JSON.parse(
      JSON.stringify(addLocationEntityPayload)
    );

    try {
      const addEntityData = await addEntity.findByPk(req.params.id);

      if (!addEntityData) {
        return next(
          CustomeErrorHandler.serverError("Advertisement Entity not found !")
        );
      }

      const updatedAddEntity = await addEntityData.update(
        addLocationEntityPayload
      );

      // const [updatedField] = await addEntity.update(addLocationEntityPayload, {
      //   where: { id: req.params.id },
      // });

      // if (updatedField != 1) {
      //   return next(
      //     CustomeErrorHandler.serverError(
      //       "Advertisement Entity update failed !"
      //     )
      //   );
      // }
      let resPayload = new ResponsePayload(updatedAddEntity);

      return res.status(200).json(resPayload);
    } catch (error) {
      if (error.errors && error.errors[0].origin == "DB") {
        return next(error.errors[0]);
      }
      return next(error);
    }
  },

  async uplaodImageS3Bucket(req, res, next) {
    try {
      const url = await generateUploadURL();
      let resPayload = new ResponsePayload({ bucketUrl: url });
      return res.status(200).json(resPayload);
    } catch (err) {
      return next(err);
    }
  },

  //list of country and city
  async getListOfCountry(req, res, next) {
    const { country_id } = req.query;
    try {
      let listData;
      if (country_id) {
        listData = stateListJson.filter((l, index) => {
          if (l.country_id == country_id) {
            return l;
          }
        });
      } else {
        listData = countryListJson.map((l) => {
          return {
            id: l.id,
            name: l.name,
            emoji: l.emoji,
          };
        });
      }
      const resPayload = new ResponsePayload(listData, "", {
        count: listData.length,
      });
      return res.status(200).json(resPayload);
    } catch (err) {
      return next(err);
    }
  },

  //Add city Price Section
  async createAddCityPrice(req, res, next) {
    const addCityPriceSchema = Joi.object({
      country_id:Joi.number().required(),
      city_name: Joi.string().required(),
      price: Joi.number().required(),
    }).error((errors) => validationMessageHandler(errors));

    const { error } = addCityPriceSchema.validate(req.body);
    if (error) {
      return next(error);
    }

    try {
      const { country_id, city_name, price } = req.body;
      let postDataPayload = {
        country_id,
        city_name,
        price,
      };
      postDataPayload = JSON.parse(JSON.stringify(postDataPayload));
      const postDataRes = await AddCityPrice.create(postDataPayload);
      let resPayload = new ResponsePayload(postDataRes);
      res.status(201).json(resPayload);
    } catch (error) {
      if (error.errors && error.errors[0].origin == "DB") {
        return next(CustomeErrorHandler.Forbidden(error.errors[0].message));
      }
      return next(error);
    }
  },
  async getAllCityPrice(req, res, next) {
    const { page = 1, limit = 10, status, searchKey } = req.query;

    const pageNumber = parseInt(page);
    const getRealNumber = isNaN(pageNumber) ? 0 : pageNumber;
    const postsOffset = limit * (getRealNumber - 1);

    try {
      let totalListOfAddCity = 0;
      let listOfAddCity = [];

      totalListOfAddCity = await AddCityPrice.count({
        where: {
          ...(status && { status: status }),
          ...(searchKey && {
            [Op.or]: [
              {
                city_name: { [Op.iLike]: `%${searchKey}%` },
              },
            ],
          }),
        },
        order: [["createdAt", "DESC"]],
        offset: postsOffset,
        limit,
      });
      listOfAddCity = await AddCityPrice.findAll({
        where: {
          ...(status && { status: status }),
          ...(searchKey && {
            [Op.or]: [
              {
                city_name: { [Op.iLike]: `%${searchKey}%` },
              },
            ],
          }),
        },
        include: [],
        order: [["createdAt", "DESC"]],
        offset: postsOffset,
        limit,
      });
      const totalPages = Math.ceil(totalListOfAddCity / limit);

      let resPayload = new ResponsePayload({
        listOfAddCity,
        totalPages,
        page,
        limit,
      });
      res.status(200).json(resPayload);
    } catch (err) {
      return next(err);
    }
  },
  async getcityPriceByCityName(req, res, next) {
    try {
      const listings = await AddCityPrice.findOne({
        where: { city_name: req.params.city_name },
      });
      let resPayload = new ResponsePayload(listings);
      res.status(200).json(resPayload);
    } catch (err) {
      return next(err);
    }
  },
  async updateCityPrice(req, res, next) {
    let valiDateSchma = Joi.object({
      price: Joi.number().required(),
    }).error((errors) => validationMessageHandler(errors));

    const { error } = valiDateSchma.validate(req.body);
    if (error) {
      return next(error);
    }
    const { price } = req.body;
    let addPricePayload = {
      price,
    };
    addPricePayload = JSON.parse(JSON.stringify(addPricePayload));

    try {
      const addPriceTable = await AddCityPrice.findOne({
        where: { city_name: req.params.city_name },
      });

      if (!addPriceTable) {
        return next(CustomeErrorHandler.serverError("city_nam not found!"));
      }

      const updateVal = await addPriceTable.update({ ...addPricePayload });
      let resPayload = new ResponsePayload(updateVal);
      res.status(200).json(resPayload);
    } catch (err) {
      return next(err);
    }
  },
  async deleteCityPrice(req, res, next) {
    try {
      const addPriceTable = await AddCityPrice.findOne({
        where: { city_name: req.params.city_name },
      });

      if (!addPriceTable) {
        return next(CustomeErrorHandler.serverError("city_name not found!"));
      }

      const updateVal = await addPriceTable.destroy();
      let resPayload = new ResponsePayload({
        msg: "city_name deleted succesfully",
      });
      res.status(200).json(resPayload);
    } catch (err) {
      return next(err);
    }
  },

  async cityAddPrice(req,res,next){
    const addCityPriceSchema = Joi.object({
      add_location_id: Joi.number().required(),
      cities_name: Joi.array().items(Joi.string().required()).required(),
      start_date_time: Joi.date().required(),
      end_date_time: Joi.date().required(),
    }).error((errors) => validationMessageHandler(errors));

    const { error } = addCityPriceSchema.validate(req.body);
    if (error) {
      return next(error);
    }
    
    const {
      add_location_id,
      cities_name,
      start_date_time,
      end_date_time,
    } = req.body;
    //request payload
    let priceData = {
      add_location_id,
      cities_name,
      start_date_time,
      end_date_time,
    };

    priceData = JSON.parse(JSON.stringify(priceData));


    try{
      const price = [];

      /** get location price */
      const locationPrice = await addLocation.findByPk(add_location_id);
      if (locationPrice){ 
        price.push({
          key: locationPrice.location_name,
          price: locationPrice.price,
        });
      }

      /** get cities price */
      for (let i = 0; i < cities_name.length; i++) {
        const cityData = await AddCityPrice.findOne({
          where: { city_name: cities_name[i] },
        });
        if (cityData) {
          price.push({
            key: cityData.city_name,
            price: cityData.price,
          });
        } else {
          const defaultPriceCity = await GlobalPrice.findOne({
            where: { entity_name: "city_price" },
          }); //this name "city_price" is predefine in db
          if (!defaultPriceCity) {
            return next(CustomeErrorHandler.serverError());
          }
          price.push({
            key: cities_name[i],
            price: defaultPriceCity.price,
          });
        }
      }
      /**price calculate by time stamp */
      const startDate = new Date(start_date_time);
      const endDate = new Date(end_date_time);
      // Calculate the difference in milliseconds
      const timeDiff = endDate.getTime() - startDate.getTime();

      // Convert milliseconds to seconds, minutes, hours, and days
      /**price calculation for hourly */
      const seconds = Math.floor(timeDiff / 1000);
      const minutes = Math.floor(seconds / 60);
      const hours = Math.floor(minutes / 60);
      const days = Math.floor(hours / 24);

      /** get the glbal price day wise */
      const defaultPerDayPrice = await GlobalPrice.findOne({
        where: { entity_name: "day_price" }, //this name "day_price" is predefine in db
      });
      if (!defaultPerDayPrice) {
        return next(CustomeErrorHandler.serverError());
      }
      price.push({
        key: `minDays: ${days ? days : 1}`,
        price: (days ? days : 1) * parseFloat(defaultPerDayPrice.price),
      });
      /** calculat total price */
      const totalPrice = price
        .map((obj) => obj.price)
        .reduce((intialVal, currentValue) => intialVal + currentValue, 0);

      let resPayload = new ResponsePayload({ totalPrice, price });
      res.status(200).json(resPayload);
    }catch(err){
      return next(err);
    }
  }
};

export default advertisementController;