import {
  Listing,
  listing_category,
  listing_category as Category, //get listing purpose
  listing_customeField_data,
  SubCategory,
  User as User,
} from "../../models";
import {ResponsePayload} from '../../middlewares';
const { Op } = require("sequelize");
import { validationMessageHandler } from "../../services/utils/joi-validiation-helper";

import Joi from 'joi';
import { CustomeErrorHandler } from "../../services";

const listingController = {
  async getListing (req, res, next) {
    // try {
    //   const listings = await Listing.findAll({
    //     include: [
    //       { model: listing_category },
    //       { model: SubCategory },
    //       { model: listing_customeField_data },
    //     ],
    //   });
    //   let resPayload = new ResponsePayload(listings);
    //   res.status(200).json(resPayload);
    // } catch (err) {
    //   return next(err);
    // }
    const { page=1, limit=6, keyword, title, location, category,userId, status } = req.query;
    //search
    const searchKeyword = keyword ? keyword : "";
    const searchTitle = title ? title : "";
    const searchLocation = location ? location : "";
    const searchCategory = category ? category : "";

    //pagination
    const pageNumber = parseInt(page);
    const getRealNumber = isNaN(pageNumber) ? 0 : pageNumber;
    const postsOffset = limit * (getRealNumber - 1);

    //ListingStatus
    const listingStatus = (status == 'all' ? true: false) //for getting all status listing

    try {
      let totalListing, listings;
      let result = { ...(searchCategory && { searchCategory }) };

      if (searchTitle || searchLocation || searchCategory) {
        totalListing = await Listing.count({
          where: {
            //checking serachTilte in the title, keyword
            ...(searchTitle && {
              [Op.or]: [
                {
                  listingTitle: { [Op.iLike]: `%${searchTitle}%` },
                },
                {
                  keyword: { [Op.iLike]: `%${searchTitle}%` },
                },
                {
                  description: { [Op.iLike]: `%${searchTitle}%` },
                },
              ],
            }),
            //checking for location
            ...(searchLocation && {
              [Op.or]: [
                {
                  location: { [Op.iLike]: `%${searchLocation}%` },
                },
                {
                  address: { [Op.iLike]: `%${searchLocation}%` },
                },
              ],
            }),
            //specific for user
            ...(userId && { userId: userId }),
            ...(!listingStatus && {status: "active"}),
          },
          include: [
            {
              model: Category,
              ...(searchCategory && {
                where: { name: { [Op.iLike]: `%${searchCategory}%` } },
              }),
            },
          ],
        });
        listings = await Listing.findAll({
          where: {
            //checking serachTilte in the title, keyword
            ...(searchTitle && {
              [Op.or]: [
                {
                  listingTitle: { [Op.iLike]: `%${searchTitle}%` },
                },
                {
                  keyword: { [Op.iLike]: `%${searchTitle}%` },
                },
                {
                  description: { [Op.iLike]: `%${searchTitle}%` },
                },
              ],
            }),
            //checking for location
            ...(searchLocation && {
              [Op.or]: [
                {
                  location: { [Op.iLike]: `%${searchLocation}%` },
                },
                {
                  address: { [Op.iLike]: `%${searchLocation}%` },
                },
              ],
            }),
            ...(userId && { userId: userId }),
            ...(!listingStatus && { status: "active" }),
          },
          include: [
            {
              model: Category,
              ...(searchCategory && {
                where: { name: { [Op.iLike]: `%${searchCategory}%` } },
              }),
            },
            {
              model: User,
              attributes: ["id", "name", "user_name", "email"],
            },
          ],
          order: [["createdAt", "DESC"]],
          offset: postsOffset,
          limit,
        });
      } else {
        totalListing = await Listing.count({
          where: {
            ...(!listingStatus && { status: "active" }),
            ...(userId && { userId: userId }),
          },
        });
        listings = await Listing.findAll({
          where: {
            ...(!listingStatus && { status: "active" }),
            ...(userId && { userId: userId }),
          },
          order: [["createdAt", "DESC"]],
          offset: postsOffset,
          limit,
          include: [
            { model: Category },
            {
              model: User,
              attributes: ["id", "name", "user_name", "email"],
            },
          ],
        });
      }

      const totalPages = Math.ceil(totalListing / limit);
      return res.send({ listings, totalPages });
    } catch (error) {
      res.status(500).send("Error in finding Listings, please try again!");
    }
  },
  
  async getMyListing(req,res,next){
  
     const { page=1, limit=6, status } = req.query;
     const { id  }= req.user;
      // let listingStatus; //for getting all status listing


      // if (status == "all") {
      //   listingStatus = true;
      // } else if (status == "active") {
      //   listingStatus = "active";
      // } else if (status == "pending") {
      //   listingStatus = "pending";
      // } else if (status == "deactive") {
      //   listingStatus = "deactive";
      // } else {
      //   listingStatus = false;
      // }

     //pagination
     const pageNumber = parseInt(page);
     const getRealNumber = isNaN(pageNumber) ? 0 : pageNumber;
     const postsOffset = limit * (getRealNumber - 1);

     try {
       let totalListing = 0;
       let listings = [];
       let activeListings = 0;
       let pendingListings = 0;

       // Count listing for admin
         activeListings = await Listing.count({
           where: {
             status: "active",
             userId: id,
           },
         });

         pendingListings = await Listing.count({
           where: {
             status: "pending",
             userId: id,
           },
         });

         totalListing = await Listing.count({
           where: {
             userId: id,
             status: status,
           },
         });

         listings = await Listing.findAll({
           where: {
             userId: id,
             status: status,
           },
           include: [{ model: Category }],
           order: [["createdAt", "DESC"]],
           offset: postsOffset,
           limit,
         });

       const totalPages = Math.ceil(totalListing / limit);
       // console.log('############=>', totalListing)
       return res.send({
         listings,
         totalPages,
         activeListings,
         pendingListings,
       });
     } catch (error) {
      // console.log(error)
       res.status(500).send("Error in finding Listings, please try again!");
     }
  },

  async getListingById(req, res, next) {
    try {
      const listings = await Listing.findOne({
        where: { id: req.params.listingId },
        include: [
          { model: listing_category },
          { model: SubCategory },
          { model: listing_customeField_data },
        ],
      });
      let resPayload = new ResponsePayload(listings);
      res.status(200).json(resPayload);
    } catch (err) {
      return next(err);
    }
  },

  async createListing(req, res, next) {

    let eatchMetaData = Joi.object().keys({
      fieldType: Joi.string().required(),
      fieldName: Joi.string().required(),
      fieldValue: Joi.any()   //may be array or string value
    });

    const listingSchma = Joi.object({
      listingTitle: Joi.string().required(),
      // userId: Joi.string().uuid().required(),
      categoryId: Joi.number().required(),
      subCategoryId: Joi.number().optional(),
      keyword: Joi.string().required(), //should be( , )seprated string
      location: Joi.string().required(),
      address: Joi.string().required(),
      zipcode: Joi.string().required(),
      gallery: Joi.array(),
      description: Joi.string().required(),
      email: Joi.string().email().required(),
      website: Joi.optional(),
      phone: Joi.string().optional(),
      facebook: Joi.optional(),
      twitter: Joi.optional(),
      linkedin: Joi.optional(),
      facilities: Joi.optional(),
      openingDay: Joi.optional(),
      closingDay: Joi.optional(),
      openingTime: Joi.optional(),
      closingTime: Joi.optional(),
      status: Joi.string().valid("active", "pending", "deactive"),
      pricing: Joi.optional(),
      customeFieldData: Joi.array().items(eatchMetaData),
    }).error((errors) => validationMessageHandler(errors));;
    const { error } = listingSchma.validate(req.body);
    if (error) {
      return next(error);
    }
    const {
      listingTitle,
      userId = req.user.id,
      categoryId,
      subCategoryId,
      keyword,
      location,
      address,
      zipcode,
      gallery,
      description,
      email,
      website,
      phone,
      facebook,
      twitter,
      linkedin,
      facilities,
      openingTime,
      closingTime,
      status,
      pricing,
    } = req.body;
    let listingPayload = {
      listingTitle,
      userId,
      categoryId,
      subCategoryId,
      keyword,
      location,
      address,
      zipcode,
      gallery,
      description,
      email,
      website,
      phone,
      facebook,
      twitter,
      linkedin,
      facilities,
      openingTime,
      closingTime,
      status,
      pricing,
    };
    listingPayload = JSON.parse(JSON.stringify(listingPayload));

    try {
      const listing = await Listing.create(listingPayload);
      if (req.body.customeFieldData) {
        try {
          const metaData = await listing_customeField_data.create({
            listingId: listing.id,
            custome_data: req.body.customeFieldData,
          });
        } catch (err) {
          //delet the created listing if error
          await Listing.destroy({
            where: { id: listing.id },
          });
          //return the error
          return next(err);
        }
      }

      let resPayload = new ResponsePayload(listing);
      res.status(200).json(resPayload);
    } catch (err) {
      return next(err);
    }
  },

  async updateListing(req, res, next) {

    let eatchMetaData = Joi.object().keys({
      fieldType: Joi.string().required(),
      fieldName: Joi.string().required(),
      fieldValue: Joi.any(), //may be array or string value
    });
    
    //data validation
    const valiDateSchma = Joi.object({
      listingTitle: Joi.string().optional(),
      categoryId: Joi.number().optional(),
      subCategoryId: Joi.number().optional(),
      keyword: Joi.string().optional(), //should be( , )seprated string
      location: Joi.string().optional(),
      address: Joi.string().optional(),
      zipcode: Joi.string().optional(),
      gallery: Joi.array(),
      description: Joi.string().optional(),
      email: Joi.string().email().optional(),
      website: Joi.optional(),
      phone: Joi.string().optional(),
      facebook: Joi.optional(),
      twitter: Joi.optional(),
      linkedin: Joi.optional(),
      facilities: Joi.optional(),
      openingDay: Joi.optional(),
      closingDay: Joi.optional(),
      openingTime: Joi.optional(),
      closingTime: Joi.optional(),
      pricing: Joi.optional(),
      // customeFieldData: Joi.array().items(eatchMetaData).optional(),
      status: Joi.string().valid("active", "pending", "deactive").optional(),
    });
    const { error } = valiDateSchma.validate(req.body);
    if (error) {
      return next(error);
    }
    const {
      listingTitle,
      categoryId,
      subCategoryId,
      keyword,
      location,
      address,
      zipcode,
      gallery,
      description,
      email,
      website,
      phone,
      facebook,
      twitter,
      linkedin,
      facilities,
      openingTime,
      closingTime,
      status,
      pricing,
    } = req.body;
    let listingPayload = {
      listingTitle,
      categoryId,
      subCategoryId,
      keyword,
      location,
      address,
      zipcode,
      gallery,
      description,
      email,
      website,
      phone,
      facebook,
      twitter,
      linkedin,
      facilities,
      openingTime,
      closingTime,
      status,
      pricing,
    };
    listingPayload = JSON.parse(JSON.stringify(listingPayload));

    try {

      const newListing = await Listing.findByPk(req.params.listingId);

      if (!newListing) {
        return next(CustomeErrorHandler.serverError("Listing not found!"));
      }

      const updatedListing = await newListing.update({ ...listingPayload });

      let resPayload = new ResponsePayload(updatedListing);
      res.status(200).json(resPayload);
    } catch (err) {
      return next(err);
    }
  },

  async deleteListingById(req, res, next) {
    try {
      const listingData = await Listing.destroy({
        where: { id: req.params.listingId },
      });
      if (listingData != 1) {
        return next(
          CustomeErrorHandler.serverError("listingData delete failed!")
        );
      }
      let resPayload = new ResponsePayload({
        msg: "listingData deleted succesfully",
      });
      return res.status(200).json(resPayload);
    } catch (err) {
      return next(err);
    }
  },
};

export default listingController;