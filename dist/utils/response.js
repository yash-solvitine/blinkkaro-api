"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.forbiddenResponse = exports.unauthorizedResponse = exports.notFoundResponse = exports.validationErrorResponse = exports.errorResponse = exports.createdResponse = exports.successResponse = void 0;
const successResponse = (res, data, message = 'Success', statusCode = 200) => {
    const response = {
        status: 'success',
        message,
        data,
    };
    return res.status(statusCode).json(response);
};
exports.successResponse = successResponse;
const createdResponse = (res, data, message = 'Resource created successfully') => {
    return (0, exports.successResponse)(res, data, message, 201);
};
exports.createdResponse = createdResponse;
const errorResponse = (res, message = 'An error occurred', statusCode = 500, errors) => {
    const response = {
        status: 'error',
        message,
        errors,
    };
    return res.status(statusCode).json(response);
};
exports.errorResponse = errorResponse;
const validationErrorResponse = (res, errors, message = 'Validation failed') => {
    return (0, exports.errorResponse)(res, message, 422, errors);
};
exports.validationErrorResponse = validationErrorResponse;
const notFoundResponse = (res, message = 'Resource not found') => {
    return (0, exports.errorResponse)(res, message, 404);
};
exports.notFoundResponse = notFoundResponse;
const unauthorizedResponse = (res, message = 'Unauthorized access') => {
    return (0, exports.errorResponse)(res, message, 401);
};
exports.unauthorizedResponse = unauthorizedResponse;
const forbiddenResponse = (res, message = 'Access forbidden') => {
    return (0, exports.errorResponse)(res, message, 403);
};
exports.forbiddenResponse = forbiddenResponse;
//# sourceMappingURL=response.js.map