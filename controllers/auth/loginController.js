import Joi from "joi";
import { User, Role } from "../../models";
import {CustomeErrorHandler, JwtService} from "../../services";
import bcrypt from "bcrypt";
import { ResponsePayload } from "../../middlewares";

const loginController = {
        async login(req, res, next) {
          //validate Request
          const loginSchma = Joi.object({
            email: Joi.string().email().required(),
            password: Joi.string()
              // .pattern(new RegExp(`^[a-zA-Z0-9]{3,30}$`))
              .required(),
          });
          const { error } = loginSchma.validate(req.body);
          if (error) {
            return next(error);
          }
          try {
            const user = await User.findOne({
              where: { email: req.body.email },
              include: [{ model: Role }],
            });
            if (!user) {
              return next(CustomeErrorHandler.wrongCredentials());
            }
            //compare the password
            const match = await bcrypt.compare(
              req.body.password,
              user.password
            );
            if (!match) {
              return next(CustomeErrorHandler.wrongCredentials());
            }
            //token genrate
            const accessToken = JwtService.sign({
              id: user.id,
              role: user.Role.role,
            });

            let resPayload = new ResponsePayload({ token:accessToken });
            res.status(200).json(resPayload);
          } catch (err) {
            return next(err);
          }
        }
};


export default loginController;