export class HttpException extends Error {
  status: number;
  message: string;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
    this.message = message;
  }
}

export class EmailUsedException extends HttpException {
  constructor(email: string) {
    super(400, `The e-mail '${email}' is already in use`);
  }
}

export class ModelIdNotFoundException extends HttpException {
  constructor(modelName: string, id: number) {
    super(404, `The ${modelName} id '${id}' was not found`);
  }
}

export class IncorrectTypeException extends HttpException {
  constructor(fieldName: string, expectedType: string, value: any) {
    super(400, `The field '${fieldName}' expected type '${expectedType}' but received '${typeof value}'`);
  }
}

export class IncorrectQueryException extends HttpException {
  constructor(queryName: string, expectedType: string, value: any) {
    super(400, `The query '${queryName}' expected type '${expectedType}' but received '${value}'`);
  }
}