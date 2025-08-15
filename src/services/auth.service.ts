import bcrypt from "bcryptjs";
import jwt, { SignOptions, Secret } from "jsonwebtoken";
import { config } from "../config/config";
import redis from "../config/redis";
import { db } from "../utils/db";
import {
  IUserCreate,
  IUserLogin,
  IUserAuthTokens,
  IUser,
} from "../domain/interfaces/user.interface";
import { BadRequestError, UnauthorizedError } from "../utils/errors";
import { log } from "../utils/logger";

export class AuthService {
  private static generateTokens(userId: string, role: string): IUserAuthTokens {
    const secret: Secret = config.jwt.secret as Secret;
    const accessOptions: SignOptions = {
      expiresIn: Number(config.jwt.expiresIn),
    };
    const refreshOptions: SignOptions = {
      expiresIn: Number(config.jwt.refreshExpiresIn),
    };

    const accessToken = jwt.sign({ userId, role }, secret, accessOptions);
    const refreshToken = jwt.sign({ userId, role }, secret, refreshOptions);

    return { accessToken, refreshToken };
  }

  private static async storeRefreshToken(
    userId: string,
    refreshToken: string
  ): Promise<void> {
    await redis.set(
      `refresh_token:${userId}`,
      refreshToken,
      "EX",
      Number(config.jwt.refreshExpiresIn)
    );
  }

  private static async revokeRefreshToken(userId: string): Promise<void> {
    await redis.del(`refresh_token:${userId}`);
  }

  public static async register(userData: IUserCreate) {
    // Check if user already exists
    const existingUsers = await db.select({
      table: "users",
      where: "email = $1",
      params: [userData.email],
    });

    if (existingUsers.length > 0) {
      throw new BadRequestError("Email already registered");
    }

    // Hash password
    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(userData.password, salt);

    try {
      // Create user
      const user: IUser = await db.insert({
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

      // Generate tokens
      const tokens = this.generateTokens(user.id, user.role);

      // Store refresh token
      await this.storeRefreshToken(user.id, tokens.refreshToken);

      // Log the registration
      log.info("User registered successfully", {
        userId: user.id,
        email: user.email,
      });

      const { password, ...userWithoutPassword } = user;
      return { user: userWithoutPassword, tokens };
    } catch (error) {
      log.error("Error during user registration", {
        error,
        email: userData.email,
      });
      throw error;
    }
  }

  public static async login({ email, password, role }: IUserLogin) {
    // Find user
    const users = await db.select({
      table: "users",
      where: "email = $1",
      params: [email],
    });

    const user: IUser = users[0] as IUser;
    if (!user) {
      throw new UnauthorizedError("Invalid credentials");
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedError("Invalid credentials");
    }

    // Check role if specified
    if (role && user.role !== role) {
      throw new UnauthorizedError("Invalid role for this user");
    }

    // Generate tokens
    const tokens = this.generateTokens(user.id, user.role);

    // Store refresh token
    await this.storeRefreshToken(user.id, tokens.refreshToken);

    // Update last login
    await db.update({
      table: "users",
      data: { last_login_at: new Date() },
      where: "id = $1",
      params: [user.id],
    });

    // Log the login
    log.info("User logged in successfully", {
      userId: user.id,
      email: user.email,
    });

    const { password: _, ...userWithoutPassword } = user;
    return { user: userWithoutPassword, tokens };
  }

  public static async refreshToken(refreshToken: string) {
    try {
      // Verify refresh token
      const decoded = jwt.verify(refreshToken, config.jwt.secret) as {
        userId: string;
        role: string;
      };

      // Check if refresh token is in Redis
      const storedToken = await redis.get(`refresh_token:${decoded.userId}`);
      if (!storedToken || storedToken !== refreshToken) {
        throw new UnauthorizedError("Invalid refresh token");
      }

      // Generate new tokens
      const tokens = this.generateTokens(decoded.userId, decoded.role);

      // Store new refresh token
      await this.storeRefreshToken(decoded.userId, tokens.refreshToken);

      return tokens;
    } catch (error) {
      if (error instanceof jwt.JsonWebTokenError) {
        throw new UnauthorizedError("Invalid refresh token");
      }
      throw error;
    }
  }

  public static async logout(userId: string) {
    await this.revokeRefreshToken(userId);
    log.info("User logged out successfully", { userId });
  }
}
