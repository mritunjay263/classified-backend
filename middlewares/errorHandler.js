import { ValidationError } from "joi";
import { DEBUG_MODE } from "../config";
import {CustomeErrorHandler} from "../services";
import { ResponsePayload } from "../middlewares";

const errorHandler = (err, req, res, next) => {
    let statusCode = 500;
    let data = {
      message: "Internal Server error",
      ...(DEBUG_MODE === "true" && { originalError: err.message }),
      ...(DEBUG_MODE === "true" && { errorStack: err.stack }),
    };

    if (err instanceof ValidationError) {
        statusCode = 422;
        data = {
            message: err.message
        }
    }

    if (err instanceof CustomeErrorHandler) {
        statusCode = err.status;
        data = {
            message: err.message
        }
    }
    
    let resPayload = new ResponsePayload();
    resPayload.message = data.message;
    resPayload.errors = data;
    return res.status(statusCode).json(resPayload);
}

export default errorHandler;