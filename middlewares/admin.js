import { CustomeErrorHandler } from "../services";
import { User ,Role} from '../models';

const admin = async (req, res, next) => {
  try {
    const user = await User.findOne({ where: { id: req.user.id },include:[{model:Role}] });
    if (user.Role.role === "admin") {
      next();
    } else {
      return next(CustomeErrorHandler.unAuthorized());
    }
  } catch (err) {
    return next(CustomeErrorHandler.serverError());
  }
};

export default admin;