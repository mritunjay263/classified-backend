class ResponsePayload {
    data = null;
    message = "";
    meta = "";
    errors = []

  constructor(
    data ,
    message="",
    meta="",
    errors
  ) {
    this.data = data;
    this.message = message;
    this.meta = meta;
    errors && this.errors.push(errors);
  }
}

export default ResponsePayload;