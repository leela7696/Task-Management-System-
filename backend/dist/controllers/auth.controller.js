"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const auth_service_1 = require("../services/auth.service");
class AuthController {
    constructor() {
        this.register = async (req, res, next) => {
            try {
                const result = await this.authService.register(req.body);
                res.status(201).json(result);
            }
            catch (error) {
                next(error);
            }
        };
        this.login = async (req, res, next) => {
            try {
                const result = await this.authService.login(req.body);
                res.status(200).json(result);
            }
            catch (error) {
                next(error);
            }
        };
        this.refresh = async (req, res, next) => {
            try {
                const { refreshToken } = req.body;
                if (!refreshToken) {
                    return res.status(400).json({ message: 'Refresh token is required' });
                }
                const result = await this.authService.refresh(refreshToken);
                res.status(200).json(result);
            }
            catch (error) {
                next(error);
            }
        };
        this.logout = async (req, res, next) => {
            try {
                const { userId } = req.user;
                await this.authService.logout(userId);
                res.status(204).send();
            }
            catch (error) {
                next(error);
            }
        };
        this.authService = new auth_service_1.AuthService();
    }
}
exports.AuthController = AuthController;
