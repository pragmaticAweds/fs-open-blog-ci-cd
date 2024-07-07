// type HttpCode = 200 | 300 | 404 | 500;

// export const commonErrorsDict: {
//   resourceNotFound: string;
//   notFound: HttpCode;
// } = {
//   resourceNotFound: "Resource not found",
//   notFound: 404,
// };

// export class AppError extends Error {
//   public readonly name: string;
//   public readonly httpCode: HttpCode;
//   public readonly isOperational: boolean;

//   constructor(
//     name: string,
//     httpCode: HttpCode,
//     description: string,
//     isOperational: boolean // for predictable errors, like http or logic error
//   ) {
//     super(description);

//     Object.setPrototypeOf(this, new.target.prototype);

//     this.name = name;
//     this.httpCode = httpCode;
//     this.isOperational = isOperational;

//     Error.captureStackTrace(this);
//   }
// }

// class ErrorHandler {
//   public async handleError(err: Error): Promise<void> {
//     // await logger.logError(err)
//     // await sendMailToAdminIfCritical()
//     // await saveInOpsQueueIfCritical()
//     // await determinsIfOperationalError()
//   }

//   public isTrustedError(err: Error) {
//     if (err instanceof AppError) {
//       return err.isOperational;
//     }
//     return false;
//   }
// }

// export const handler = new ErrorHandler();
