"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const auth_service_1 = require("../services/auth.service");
const user_schema_1 = require("../domain/schemas/user.schema");
const response_1 = require("../utils/response");
const errors_1 = require("../utils/errors");
class AuthController {
    static async register(req, res) {
        try {
            const validatedData = user_schema_1.userCreateSchema.parse(req.body);
            const result = await auth_service_1.AuthService.register(validatedData);
            return (0, response_1.createdResponse)(res, result);
        }
        catch (error) {
            return (0, response_1.errorResponse)(res, error);
        }
    }
    static async login(req, res) {
        try {
            const validatedData = user_schema_1.userLoginSchema.parse(req.body);
            const result = await auth_service_1.AuthService.login(validatedData);
            return (0, response_1.successResponse)(res, result);
        }
        catch (error) {
            return (0, response_1.errorResponse)(res, error);
        }
    }
    static async refreshToken(req, res) {
        try {
            const { refreshToken } = req.body;
            if (!refreshToken) {
                throw new errors_1.ValidationError('Refresh token is required');
            }
            const tokens = await auth_service_1.AuthService.refreshToken(refreshToken);
            return (0, response_1.successResponse)(res, tokens);
        }
        catch (error) {
            return (0, response_1.errorResponse)(res, error);
        }
    }
    static async logout(req, res) {
        var _a;
        try {
            const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
            if (!userId) {
                throw new errors_1.ValidationError('User ID is required');
            }
            await auth_service_1.AuthService.logout(userId);
            return (0, response_1.successResponse)(res, null, 'Logged out successfully');
        }
        catch (error) {
            return (0, response_1.errorResponse)(res, error);
        }
    }
}
exports.AuthController = AuthController;
//# sourceMappingURL=auth.controller.js.map