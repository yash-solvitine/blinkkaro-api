"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = require("../config/config");
const redis_1 = __importDefault(require("../config/redis"));
const db_1 = require("../utils/db");
const errors_1 = require("../utils/errors");
const logger_1 = require("../utils/logger");
class AuthService {
    static generateTokens(userId, role) {
        const secret = config_1.config.jwt.secret;
        const accessOptions = {
            expiresIn: Number(config_1.config.jwt.expiresIn),
        };
        const refreshOptions = {
            expiresIn: Number(config_1.config.jwt.refreshExpiresIn),
        };
        const accessToken = jsonwebtoken_1.default.sign({ userId, role }, secret, accessOptions);
        const refreshToken = jsonwebtoken_1.default.sign({ userId, role }, secret, refreshOptions);
        return { accessToken, refreshToken };
    }
    static async storeRefreshToken(userId, refreshToken) {
        await redis_1.default.set(`refresh_token:${userId}`, refreshToken, "EX", Number(config_1.config.jwt.refreshExpiresIn));
    }
    static async revokeRefreshToken(userId) {
        await redis_1.default.del(`refresh_token:${userId}`);
    }
    static async register(userData) {
        const existingUsers = await db_1.db.select({
            table: "users",
            where: "email = $1",
            params: [userData.email],
        });
        if (existingUsers.length > 0) {
            throw new errors_1.BadRequestError("Email already registered");
        }
        const salt = await bcryptjs_1.default.genSalt(12);
        const hashedPassword = await bcryptjs_1.default.hash(userData.password, salt);
        try {
            const user = await db_1.db.insert({
                table: "users",
                data: {
                    email: userData.email,
                    password: hashedPassword,
                    first_name: userData.firstName,
                    last_name: userData.lastName,
                    phone_number: userData.phoneNumber,
                    country_code: userData.countryCode,
                    country: userData.country,
                    birth_date: userData.birthDate,
                    gender: userData.gender,
                    role: userData.role || "CUSTOMER",
                },
            });
            const tokens = this.generateTokens(user.id, user.role);
            await this.storeRefreshToken(user.id, tokens.refreshToken);
            logger_1.log.info("User registered successfully", {
                userId: user.id,
                email: user.email,
            });
            const { password } = user, userWithoutPassword = __rest(user, ["password"]);
            return { user: userWithoutPassword, tokens };
        }
        catch (error) {
            logger_1.log.error("Error during user registration", {
                error,
                email: userData.email,
            });
            throw error;
        }
    }
    static async login({ email, password, role }) {
        const users = await db_1.db.select({
            table: "users",
            where: "email = $1",
            params: [email],
        });
        const user = users[0];
        if (!user) {
            throw new errors_1.UnauthorizedError("Invalid credentials");
        }
        const isPasswordValid = await bcryptjs_1.default.compare(password, user.password);
        if (!isPasswordValid) {
            throw new errors_1.UnauthorizedError("Invalid credentials");
        }
        if (role && user.role !== role) {
            throw new errors_1.UnauthorizedError("Invalid role for this user");
        }
        const tokens = this.generateTokens(user.id, user.role);
        await this.storeRefreshToken(user.id, tokens.refreshToken);
        await db_1.db.update({
            table: "users",
            data: { last_login_at: new Date() },
            where: "id = $1",
            params: [user.id],
        });
        logger_1.log.info("User logged in successfully", {
            userId: user.id,
            email: user.email,
        });
        const { password: _ } = user, userWithoutPassword = __rest(user, ["password"]);
        return { user: userWithoutPassword, tokens };
    }
    static async refreshToken(refreshToken) {
        try {
            const decoded = jsonwebtoken_1.default.verify(refreshToken, config_1.config.jwt.secret);
            const storedToken = await redis_1.default.get(`refresh_token:${decoded.userId}`);
            if (!storedToken || storedToken !== refreshToken) {
                throw new errors_1.UnauthorizedError("Invalid refresh token");
            }
            const tokens = this.generateTokens(decoded.userId, decoded.role);
            await this.storeRefreshToken(decoded.userId, tokens.refreshToken);
            return tokens;
        }
        catch (error) {
            if (error instanceof jsonwebtoken_1.default.JsonWebTokenError) {
                throw new errors_1.UnauthorizedError("Invalid refresh token");
            }
            throw error;
        }
    }
    static async logout(userId) {
        await this.revokeRefreshToken(userId);
        logger_1.log.info("User logged out successfully", { userId });
    }
}
exports.AuthService = AuthService;
//# sourceMappingURL=auth.service.js.map