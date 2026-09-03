export class ApiError extends Error {
  constructor(statusCode, message, errorCode = 'REQUEST_FAILED', details = undefined) {
    super(message);
    this.statusCode = statusCode;
    this.errorCode = errorCode;
    this.details = details;
  }
}
