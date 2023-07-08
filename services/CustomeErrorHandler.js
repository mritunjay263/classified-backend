class CustomeErrorHandler extends Error {
  constructor(status, msg) {
    super();
    this.status = status;
    this.message = msg;
  }

  static alreadyExist(message) {
    return new CustomeErrorHandler(409, message);
  }
  static wrongCredentials(message = `User or password is wrong`) {
    return new CustomeErrorHandler(401, message);
  }
  static unAuthorized(message = `unAuthorized`) {
    return new CustomeErrorHandler(401, message);
  }
  static notFound(message = `404 not found`) {
    return new CustomeErrorHandler(404, message);
  }
  static Forbidden(message = `403 Forbidden Error`) {
    return new CustomeErrorHandler(403, message);
  }
  static serverError(message = `Internal Server Error`) {
    return new CustomeErrorHandler(500, message);
  }
  static badRequest(message = "invalid or bad request !") {
    return new CustomeErrorHandler(400, message);
  }
}

export default CustomeErrorHandler;