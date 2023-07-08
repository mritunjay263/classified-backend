import {
  listing_category,
  Listing,
  SubCategory,
  CustomeFieldMeta,
} from "../../models";
import { ResponsePayload } from "../../middlewares";
import Joi from "joi";
import { CustomeErrorHandler } from "../../services";

const CategoryController={

    async getAll(req,res,next){
      const { status } = req.query;
        try {
            const categories = await listing_category.findAll({
              where:{
                ...(status && {status})
              },
              // include: [{ model: Listing }, { model: SubCategory }],
              order: [["createdAt", "DESC"]],
            });
            let resPayload = new ResponsePayload(
              {allCategories: categories }
            );
            res.status(200).json(resPayload);
        } catch (err) {
          return next(err);
        }
    },

    async getSingleCategory(req,res,next){
      // console.log('xxxxxxxxxxxxxxxxxxxxxx '+req.params.categoryId);
        try {
            const category = await listing_category.findOne({
              where: { id: req.params.categoryId },
              include: [
                // { model: Listing },
                { model: SubCategory, order: [["createdAt", "DESC"]] },
                {
                  model: CustomeFieldMeta,
                  // where: { active: true },
                  // order: [["createdAt", "DESC"]],
                },
              ],
            });
            let resPayload = new ResponsePayload({ category });
            res.status(200).json(resPayload);
        } catch (err) {
          return next(err);
        }
    },

    async createCategory(req,res,next){
        //   data validation
          const categorySchme = Joi.object({
            name: Joi.string().required(),
            icon: Joi.string().required(),
            info: Joi.string(),
            status: Joi.string().valid("active", "pending", "deactive").optional(),
          });
          const { error } = categorySchme.validate(req.body);
          if (error) {
            return next(error);
          }
          try {
            const { name,icon,info } = req.body;
            let category = {
              name,
              icon,
              info,
            };
            category = JSON.parse(JSON.stringify(category));
            const result = await listing_category.create(category);
            let resPayload = new ResponsePayload({ result });
            res.status(200).json(resPayload);

          } catch (err) {
            return next(err);
          }
    },

    async deleteCategory(req,res,next){
      try{
          const category = await listing_category.destroy({
            where: { id: req.params.categoryId },
          });
          if (category != 1) {
            return next(
              CustomeErrorHandler.serverError(
                "Category delete failed!"
              )
            );
          }
          let resPayload = new ResponsePayload({
            msg: "Category deleted succesfully",
          });
          return res.status(200).json(resPayload);
      }catch (err) {
          return next(err);
        }
    }

};

export default CategoryController;

