import { SubCategory, CustomeFieldMeta, listing_category } from "../../models";
import { CustomeErrorHandler, fsService } from "../../services";
import { ResponsePayload } from "../../middlewares";
import Joi from "joi";

import { sequelize } from "../../models";

const subCategoryController = {
  async getAllSubCategory(req, res, next) {
      const { status,id } = req.query;
    try {
      const subCategories = await SubCategory.findAll({
          where: { 
           ...(id &&{id}),
          ...(status && { status }) },
        include: [{ model: listing_category }],
      });
      // let actualColum = [];
      // let allFieldInfo = [];
      // if (allFields.length > 0) {
      //   actualColum = allFields[0]["_options"].attributes;
      //   //filter the new colum added after
      //   actualColum = actualColum.filter((field) => {
      //     const arr = [
      //       "id",
      //       "name",
      //       "info",
      //       "categoryId",
      //       "createdAt",
      //       "updatedAt",
      //     ];
      //     if (!arr.includes(field)) {
      //       return field;
      //     }
      //   });
      //   if(actualColum.length>0){
      //   const promise = new Promise((resolve, reject) => {
      //     // added the colum info data from CustomeFieldMeta
      //     actualColum.forEach(async (field) => {
      //       try {
      //         let info = await CustomeFieldMeta.findOne({
      //           where: { name: field },
      //           attributes: ["name", "info"],
      //         });
      //         if (info) {
      //           allFieldInfo.push(info);
      //         }
      //         resolve();
      //       } catch (err) {
      //         reject([]);
      //       }
      //     });
      //   });
      //   promise
      //     .then(() => {
      //       let resPayload = new ResponsePayload({
      //         allFields,
      //         allFieldInfo,
      //       });
      //       return res.status(200).json(resPayload);
      //     })
      //     .catch((err) => {
      //       return next(err);
      //     });
      //   }
      //   else{
      //     let resPayload = new ResponsePayload({
      //       allFields,
      //       allFieldInfo,
      //     });
      //     return res.status(200).json(resPayload);
      //   }

      // } else {
      //   let resPayload = new ResponsePayload({
      //     allFields,
      //     allFieldInfo,
      //   });
      //   return res.status(200).json(resPayload);
      // }
      let resPayload = new ResponsePayload({
        subCategories,
      });
      return res.status(200).json(resPayload);
    } catch (err) {
      return next(err);
    }
  },

  async createSubCategory(req, res, next) {
    const subCategorySchme = Joi.object({
      name: Joi.string().required(),
      info: Joi.string().optional(),
      categoryId: Joi.number().required(),
      status: Joi.string().valid("active", "pending", "deactive").optional(),
    });
    const { error } = subCategorySchme.validate(req.body);
    if (error) {
      return next(error);
    }

    const { name,info,categoryId,status } = req.body;
    let subCategoryData = {
      name,info,categoryId,status
    };
    subCategoryData = JSON.parse(JSON.stringify(subCategoryData));

    try {
      const subCategory = await SubCategory.create(subCategoryData);
      let resPayload = new ResponsePayload({ subCategory });
      res.status(200).json(resPayload);
    } catch (err) {
      return next(err);
    }
  },

  async deleteSubCategory(req, res, next) {
    try {
      const subCategory = await SubCategory.destroy({
        where: { id: req.params.subCategoryId },
      });
      if (subCategory != 1) {
        return next(
          CustomeErrorHandler.serverError("subCategory delete failed!")
        );
      }
      let resPayload = new ResponsePayload({
        msg: "subCategory deleted succesfully",
      });
      return res.status(200).json(resPayload);
    } catch (err) {
      return next(err);
    }
  },

  /**custome field section */

  async getAllCustomeField(req, res, next) {
    //customeFieldId?3
    try {
      const customeFields = await CustomeFieldMeta.findAll({
        ...(req.query.customeFieldId && {
          where: { id: req.query.customeFieldId },
        }),
        include: [{ model: listing_category }],
      });
      let resPayload = new ResponsePayload({
        customeFields,
      });
      return res.status(200).json(resPayload);
    } catch (err) {
      return next(err);
    }
  },

  async createCustomeField(req, res, next) {
    //data validation
    const customeFieldsSchma = Joi.object({
      name: Joi.string().required(),
      categoryId: Joi.number().required(),
      type: Joi.string().valid(
        "text",
        "file",
        "url",
        "number",
        "videoUrl",
        "textarea",
        "checkboxMulti",
        "selectBox",
        "radio",
        "date",
        "dateTime",
        "dateRange"
      ),
      fieldLength: Joi.number().optional(),
      defaultValue: Joi.string().optional(),
      required: Joi.boolean(),
      helpText: Joi.string().optional(),
      useAsFilter: Joi.boolean(),
      active: Joi.boolean(),
      options: Joi.array().items(Joi.string()).optional(),
    });
    //*Note : if the type is
    // "checkboxMulti","selectBox","radio"
    // then we Provide its options as array in options key else Dont send options key in Payload
    // *Ex: options: ['option1','option2'] for type SelectBox

    const { error } = customeFieldsSchma.validate(req.body);
    if (error) {
      return next(error);
    }

    let fieldsSchma = {
      name: req.body.name,
      categoryId: req.body.categoryId,
      type: req.body.type,
      fieldLength: req.body.fieldLength,
      defaultValue: req.body.defaultValue,
      required: req.body.required,
      helpText: req.body.helpText,
      useAsFilter: req.body.useAsFilter,
      active: req.body.active,
      options: req.body.options,
    };
    //         case "text":
    //         case "file":
    //         case "url":
    //         case "number":
    //         case "videoUrl":
    //         case "textarea":
    //         case "checkboxMulti":  `TEXT []`
    //         case "selectBox":      `TEXT []`
    //         case "radio":          `TEXT []`
    //         case "date":
    //         case "dateTime":
    //         case "dateRange":       `TEXT []`

    fieldsSchma = JSON.parse(JSON.stringify(fieldsSchma));
    //check for option validation
    const typeArray = ["checkboxMulti", "selectBox", "radio"];

    if (typeArray.includes(fieldsSchma.type) && !fieldsSchma.options) {
      return next(
        CustomeErrorHandler.alreadyExist(
          "For Provided type of field Options are required !"
        )
      );
    }
    if (!typeArray.includes(fieldsSchma.type) && fieldsSchma.options) {
      return next(
        CustomeErrorHandler.alreadyExist(
          "For Provided type of field Options are not required !"
        )
      );
    }
    try {
      const Customefield = await CustomeFieldMeta.create(fieldsSchma);
      let resPayload = new ResponsePayload({ Customefield });
      res.status(200).json(resPayload);
    } catch (err) {
      return next(err.errors[0] || err);
    }

    /**  try {
      await CustomeFieldMeta.create(fieldsSchma)
        .then(async (result) => {
          //change data type
          switch (fieldsSchma.type) {
            case "text":
            case "file":
            case "url":
            case "number":
            case "videoUrl":
              fieldsSchma.type = `VARCHAR(${
                fieldsSchma.fieldLength || 255
              })`;
              break;
            case "textarea":
              fieldsSchma.type = `TEXT`;
              break;
            case "checkboxMulti":
            case "selectBox":
            case "radio":
              fieldsSchma.type = `TEXT []`; //array data type
              break;
            case "date":
            case "dateTime":
            case "dateRange":
              fieldsSchma.type = `TEXT []`; //array data type
              break;
            default:
              fieldsSchma.type = `VARCHAR(255)`;
              break;
          }
          await sequelize.queryInterface
            .addColumn("SubCategories", fieldsSchma.name, {
              type: fieldsSchma.info.type,
              require: fieldsSchma.info.required,
              defaultValue: fieldsSchma.info.defaultValue,
            })
            .then(
              //append the tabel name in model file
              (res) => {
                // let code = new Array();
                // let codeString = "";
                // fsModule.readFile(
                //   "models/subCategory.js",
                //   "utf-8",
                //   function (err, data) {
                //     if (err) {
                //       console.log(err);
                //     }
                //     code.push(...data.split("\n"));
                //     code.splice(
                //       -9,
                //       0,
                //       "      " + `${fieldsSchma.name}:DataTypes.STRING`
                //     );
                //     codeString = code.join("\n");
                //     fsModule.writeFile(
                //       "models/subCategory.js",
                //       codeString,
                //       "utf-8",
                //       (err2) => {
                //         if (err2) {
                //           console.log(err2);
                //         }
                //       }
                //     );
                //   }
                // );
                fsService.writeInFile("models/subCategory.js", -9, "      " + `${fieldsSchma.name}:DataTypes.STRING`)
                .catch((reject)=>{
                    console.log(reject);
                })
              }
            )
            //.then(async()=>{
            //     //add constraint
            //     await sequelize.queryInterface.addConstraint("SubCategories", {
            //       fields: [fieldsSchma.name],
            //       type: "foreign key",
            //       references: {
            //         table: "CustomeFieldMeta",
            //         field:"name",
            //       },
            //       onDelete:"CASCADE"
            //     });
            // })
            .then((result) => {
              let resPayload = new ResponsePayload({
                msg: "field created succesfully",
              });
              res.status(200).json(resPayload);
            })
            .catch((err) => {
              //also delte the meta tabel create data
              //pending
              console.log(err);
              return next(err);
            });
        })
        .catch((err) => {
          return next(err);
        });
    } catch (err) {
      return next(err);
    }*/

    /** try{
        const newField = await CustomeFieldMeta.create(fieldsSchma).catch(
          (err) => {
            console.log(err);
          }
        );
        if(newField){
          await sequelize.queryInterface
            .addColumn("SubCategories", fieldsSchma.name, {
              type: fieldsSchma.type,
              require: fieldsSchma.required,
              defaultValue: fieldsSchma.defaultValue,
            })
            .catch(err=>{
              console.log(err)
            })
        }
        // .then(
        //   //append the tabel name in model file
        //   (res)=>{
        //     let code = new Array;
        //     let codeString="";
        //     fsModule.readFile(
        //       "models/subCategory.js",
        //       "utf-8",
        //       function (err, data) {
        //         if (err) {
        //           console.log(err)
        //         }
        //         code.push(...data.split("\n"));
        //         code.splice(-9, 0, "      "+`${fieldsSchma.name}:DataTypes.STRING`);
        //         codeString = code.join("\n");
        //         fsModule.writeFile(
        //           "models/subCategory.js",
        //           codeString,
        //           "utf-8",
        //           (err2) => {
        //             if (err2) {
        //               console.log(err2);
        //             }
        //           }
        //         );
        //       }
        //     );
        //   }
        // )
        
      }
      catch (err) {
           return next(err);
         }
 */
  },

  async getOnlyFieldsName(req, res, next) {
    try {
      let allFields = await SubCategory.findOne();
      if (allFields) {
        allFields = allFields["_options"].attributes; //get only keys
      } else {
        allFields = [];
      }
      let resPayload = new ResponsePayload({ allFields });
      res.status(200).json(resPayload);
    } catch (err) {
      return next(err);
    }
  },

  /** async delteCustomeField(req, res, next) {
    const columnName = req.body.columnName;
    try {
      await sequelize.queryInterface
        .removeColumn("SubCategories", columnName)
        .then(async () => {
          await CustomeFieldMeta.destroy({
            where: { name: req.body.columnName },
          });
        })
        .then(async () => {
          let code = new Array();
          let codeString = "";
          fsModule.readFile(
            "models/subCategory.js",
            "utf-8",
            function (err, data) {
              if (err) {
                console.log(err);
              }
              code.push(...data.split("\n"));
              // now remove that line of code code Array
              for (let i = 0; i < code.length; i++) {
                if (code[i].includes(columnName)) {
                  let lineCode = code[i].split(":");
                  lineCode.forEach((val) => {
                    if (val.trim() == columnName) {
                      code.splice(i, 1);
                      return;
                    }
                  });
                }
              }
              //now apppend the code in model page
              codeString = code.join("\n");
              fsModule.writeFile(
                "models/subCategory.js",
                codeString,
                "utf-8",
                (err2) => {
                  if (err2) {
                    console.log(err2);
                  }
                }
              );
            }
          );
        })
        .then((result) => {
          let resPayload = new ResponsePayload({
            msg: "field delete succesfully",
          });
          return res.status(200).json(resPayload);
        });
    } catch (err) {
      return next(err);
    }
  }, */

  async delteCustomeField(req, res, next) {
    try {
      const customeField = await CustomeFieldMeta.destroy({
        where: { id: req.params.fieldId },
      });
      if (customeField != 1) {
        return next(
          CustomeErrorHandler.serverError("CustomeField deleted failed!")
        );
      }
      let resPayload = new ResponsePayload({
        msg: "CustomeField deleted succesfully",
      });
      return res.status(200).json(resPayload);
    } catch (err) {
      return next(err);
    }
  },

  async changeCustomeFieldData(req, res, next) {
    //data validation
    const customeFieldsSchma = Joi.object({
      name: Joi.string().optional(),
      categoryId: Joi.number().optional(),
      type: Joi.string()
        .valid(
          "text",
          "file",
          "url",
          "number",
          "videoUrl",
          "textarea",
          "checkboxMulti",
          "selectBox",
          "radio",
          "date",
          "dateTime",
          "dateRange"
        )
        .optional(),
      fieldLength: Joi.number().optional(),
      defaultValue: Joi.string().optional(),
      required: Joi.boolean().optional(),
      helpText: Joi.string().optional().optional(),
      useAsFilter: Joi.boolean().optional(),
      active: Joi.boolean().optional(),
      options: Joi.array().items(Joi.string()).optional(),
    });
    const { error } = customeFieldsSchma.validate(req.body);
    if (error) {
      return next(error);
    }

    let fieldsSchma = {
      name: req.body.name,
      categoryId: req.body.categoryId,
      type: req.body.type,
      fieldLength: req.body.fieldLength,
      defaultValue: req.body.defaultValue,
      required: req.body.required,
      helpText: req.body.helpText,
      useAsFilter: req.body.useAsFilter,
      active: req.body.active,
      options: req.body.options,
    };
    fieldsSchma = JSON.parse(JSON.stringify(fieldsSchma));

    //some types
    const typeArray = ["checkboxMulti", "selectBox", "radio"];
    try {
      //validation for option field
      if (fieldsSchma.options && !fieldsSchma.type) {
        const fieldData = await CustomeFieldMeta.findByPk(req.params.fieldId);
        if (!fieldData.type.includes(typeArray)) {
          return next(
            CustomeErrorHandler.notFound(
              `Can not update the option field Since its not allowed for the used custome type :${fieldData.type}`
            )
          );
        }
      }
      //now update field
      const [updateField] = await CustomeFieldMeta.update(fieldsSchma, {
        where: { id: req.params.fieldId },
      });
      if (updateField != 1) {
        return next(
          CustomeErrorHandler.serverError("CustomeField entity update failed!")
        );
      }
      let resPayload = new ResponsePayload({
        msg: "CustomeField entity updated successfully !",
      });
      return res.status(200).json(resPayload);
    } catch (err) {
      return next(err.errors[0] || err);
    }
  },
};

export default subCategoryController;
