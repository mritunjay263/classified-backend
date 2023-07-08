import { CustomeErrorHandler, JwtService } from "../services";

const decodeToken = async (req, res, next) => {
  let authHeader = req.headers.authorization;
  if (!authHeader) {
    return next();
  }
  const token = authHeader.includes("Bearer")
    ? authHeader.split(" ")[1]
    : authHeader;
  try {
    const { id, role, userId } = await JwtService.verify(token);
    req.user = {}; //attaching a user object to req;
    req.user.id = id || userId;
    req.user.role = role;
    next();
  } catch (err) {
    // console.log(err)
    return next();
  }
};

export default decodeToken;
