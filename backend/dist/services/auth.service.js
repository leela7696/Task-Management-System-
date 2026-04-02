"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const user_repository_1 = require("../repositories/user.repository");
const password_util_1 = require("../utils/password.util");
const jwt_util_1 = require("../utils/jwt.util");
class AuthService {
    constructor() {
        this.userRepository = new user_repository_1.UserRepository();
    }
    async register(userData) {
        const { email, password, name } = userData;
        const existingUser = await this.userRepository.findByEmail(email);
        if (existingUser) {
            throw { status: 400, message: 'User already exists' };
        }
        const hashedPassword = await password_util_1.PasswordUtil.hash(password);
        const user = await this.userRepository.create({
            email,
            password: hashedPassword,
            name,
        });
        const payload = { userId: user.id, email: user.email };
        const accessToken = jwt_util_1.JwtUtil.generateAccessToken(payload);
        const refreshToken = jwt_util_1.JwtUtil.generateRefreshToken(payload);
        await this.userRepository.updateRefreshToken(user.id, refreshToken);
        const { password: _, refreshToken: __, ...userWithoutPassword } = user;
        return { user: userWithoutPassword, accessToken, refreshToken };
    }
    async login(loginData) {
        const { email, password } = loginData;
        const user = await this.userRepository.findByEmail(email);
        if (!user) {
            throw { status: 401, message: 'Invalid credentials' };
        }
        const isPasswordValid = await password_util_1.PasswordUtil.compare(password, user.password);
        if (!isPasswordValid) {
            throw { status: 401, message: 'Invalid credentials' };
        }
        const payload = { userId: user.id, email: user.email };
        const accessToken = jwt_util_1.JwtUtil.generateAccessToken(payload);
        const refreshToken = jwt_util_1.JwtUtil.generateRefreshToken(payload);
        await this.userRepository.updateRefreshToken(user.id, refreshToken);
        const { password: _, refreshToken: __, ...userWithoutPassword } = user;
        return { user: userWithoutPassword, accessToken, refreshToken };
    }
    async refresh(refreshToken) {
        try {
            const payload = jwt_util_1.JwtUtil.verifyRefreshToken(refreshToken);
            const user = await this.userRepository.findById(payload.userId);
            if (!user || user.refreshToken !== refreshToken) {
                throw { status: 401, message: 'Invalid refresh token' };
            }
            const newPayload = { userId: user.id, email: user.email };
            const newAccessToken = jwt_util_1.JwtUtil.generateAccessToken(newPayload);
            const newRefreshToken = jwt_util_1.JwtUtil.generateRefreshToken(newPayload);
            await this.userRepository.updateRefreshToken(user.id, newRefreshToken);
            return { accessToken: newAccessToken, refreshToken: newRefreshToken };
        }
        catch (error) {
            throw { status: 401, message: 'Invalid refresh token' };
        }
    }
    async logout(userId) {
        await this.userRepository.updateRefreshToken(userId, null);
    }
}
exports.AuthService = AuthService;
