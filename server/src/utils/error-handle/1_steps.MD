- Extends default Error Object

<!-- Bad Practice -->

<!--

Avoid this => throw("ordinary string")

- This is throwing ordinary String

 -->

<!-- Best Practice -->

<!--

Extend default error Object

Fields - Error Name, HTTP Code, Error description, IsOperational

 -->

<!-- Illutration Below -->

type HttpCode = 200 | 300 | 404 | 500

const commonErrorsDict: {resourceNotFound: string, notFound: HttpCode} = {
resourceNotFound: 'Resource not found',
notFound: 404,
}

export class AppError extends Error {

public readonly name: string;
public readonly httpCode: HttpCode;
public readonly isOperational: boolean;

constructor(name: string, httpCode: HttpCode, description: string, isOperational: boolean) {
super
}

}
