import Joi from "joi";
import bcrypt from "bcrypt";
import db from '../../models';
import { CustomeErrorHandler, JwtService } from "../../services";
import { ResponsePayload } from '../../middlewares';

const RegisterController ={
        async register(req, res, next) {

          const passwordSchema = Joi.string()
            .min(4)
            .max(12)
            .pattern(
              /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_\-+={}[\]\\|:;"'<>,.?/]).+$/
            )
            .required()
            .messages({
              "string.min": "Password must be at least 4 characters long",
              "string.max": "Password must not exceed 12 characters",
              "string.pattern.base":
                "Password must contain at least 1 uppercase letter, 1 lowercase letter, 1 special character, and 1 number",
              "any.required": "Password is required",
            });
          const registerSchma = Joi.object({
            name: Joi.string().min(3).max(30).required(),
            email: Joi.string().email().required(),
            password: passwordSchema,
            // Joi.string()
            //   .pattern(new RegExp(`^[a-zA-Z0-9]{3,30}$`)) //minmum 4 and max 12 with 1 special charecter and ..
            //   .required()
            //   .error((err) => {
            //     err[0].message =
            //       "Password Must Contain 1 Number,Upper case and 1 Lower case letter no special charcter";
            //     return err;
            //   }),
            avatar: Joi.string().optional(),
            phoneNumber: Joi.string().optional(),
            address: Joi.string().optional(),
            website: Joi.string().optional(),
            bio: Joi.string().optional(),
            fbUrl: Joi.string().optional(),
            twtUrl: Joi.string().optional(),
            linkUrl: Joi.string().optional(),
            insUrl: Joi.string().optional(),

            originCountry: Joi.string().optional().allow(""),
            originState: Joi.string().optional().allow(""),
            originCity: Joi.string().optional().allow(""),

            livingCountry: Joi.string().optional().allow(""),
            livingState: Joi.string().optional().allow(""),
            livingCity: Joi.string().optional().allow(""),
            motherTongue: Joi.string().required(),

            roleId: Joi.number(),
            confirmPassword: Joi.any()
              .equal(Joi.ref("password"))
              .required()
              .messages({
                "any.only": "{{#label}} does not match",
              }),
          });
          const { error } = registerSchma.validate(req.body);
          if (error) {
            return next(error);
          }
          //check if user is in database
          try {
            const exist = await db.User.findOne({
              where: { email: req.body.email },
            });
            if (exist) {
              return next(
                CustomeErrorHandler.alreadyExist("This email is allready taken")
              );
            }
          } catch (err) {
            return next(err);
          }
          const {
            name,
            email,
            password,
            roleId = 2,
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
          } = req.body; //object destruture
          //hash password
          const hashedPassword = await bcrypt.hash(password, 10);
          //prepare the model
          let user = {
            name,
            email,
            password: hashedPassword,
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
          /** genrate uniq userName */
          await genrateUsername(user.name).then(user_name=>{
            user.user_name=user_name
            // console.log(user.user_name)
          })
          user = JSON.parse(JSON.stringify(user));

          let accessToken;
         try {
           //create user
           const result = await db.User.create(user);
           await db.User.findOne({
              where: { id: result.id },
              include: [{ model: db.Role }],
            }).then(user=>{
              //genrate token
              accessToken = JwtService.sign({
                id: user.id,
                role: user.Role.role,
              });
              //Token
              let resPayload = new ResponsePayload({ token:accessToken });
              res.status(200).json(resPayload);
            })

         } catch (err) {
           return next(err);
         }
        }
};

async function genrateUsername(firstName, suffix = Math.floor(Math.random() * 10000)) {
  const username = `${firstName.toLowerCase().replace(/ /g, "")}_${suffix}`;

  /** check if userName exist or not */
  try {
    const userData = await db.User.findOne({
      where: { user_name: username },
    });
    if (userData) {
      const newSuffix = suffix + 1 ;
      return genrateUsername(firstName, newSuffix);
    }
    return username;
  } catch (err) {
    return next(err);
  }
}

export default RegisterController;