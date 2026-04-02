"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRepository = void 0;
const prisma_1 = __importDefault(require("../config/prisma"));
class UserRepository {
    constructor() {
        this.prisma = prisma_1.default;
    }
    async findByEmail(email) {
        return this.prisma.user.findUnique({ where: { email } });
    }
    async findById(id) {
        return this.prisma.user.findUnique({ where: { id } });
    }
    async create(data) {
        return this.prisma.user.create({ data });
    }
    async updateRefreshToken(userId, refreshToken) {
        return this.prisma.user.update({
            where: { id: userId },
            data: { refreshToken },
        });
    }
}
exports.UserRepository = UserRepository;
