import { UserRepository } from '../repositories/user.repository';
import { PasswordUtil } from '../utils/password.util';
import { JwtUtil, TokenPayload } from '../utils/jwt.util';
import { User } from '@prisma/client';

export class AuthService {
  private userRepository: UserRepository;

  constructor() {
    this.userRepository = new UserRepository();
  }

  public async register(userData: any): Promise<{ user: Partial<User>; accessToken: string; refreshToken: string }> {
    const { email, password, name } = userData;

    const existingUser = await this.userRepository.findByEmail(email);
    if (existingUser) {
      throw { status: 400, message: 'User already exists' };
    }

    const hashedPassword = await PasswordUtil.hash(password);
    const user = await this.userRepository.create({
      email,
      password: hashedPassword,
      name,
    });

    const payload: TokenPayload = { userId: user.id, email: user.email };
    const accessToken = JwtUtil.generateAccessToken(payload);
    const refreshToken = JwtUtil.generateRefreshToken(payload);

    await this.userRepository.updateRefreshToken(user.id, refreshToken);

    const { password: _, refreshToken: __, ...userWithoutPassword } = user;
    return { user: userWithoutPassword, accessToken, refreshToken };
  }

  public async login(loginData: any): Promise<{ user: Partial<User>; accessToken: string; refreshToken: string }> {
    const { email, password } = loginData;

    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      throw { status: 401, message: 'Invalid credentials' };
    }

    const isPasswordValid = await PasswordUtil.compare(password, user.password);
    if (!isPasswordValid) {
      throw { status: 401, message: 'Invalid credentials' };
    }

    const payload: TokenPayload = { userId: user.id, email: user.email };
    const accessToken = JwtUtil.generateAccessToken(payload);
    const refreshToken = JwtUtil.generateRefreshToken(payload);

    await this.userRepository.updateRefreshToken(user.id, refreshToken);

    const { password: _, refreshToken: __, ...userWithoutPassword } = user;
    return { user: userWithoutPassword, accessToken, refreshToken };
  }

  public async refresh(refreshToken: string): Promise<{ accessToken: string; refreshToken: string }> {
    try {
      const payload = JwtUtil.verifyRefreshToken(refreshToken);
      const user = await this.userRepository.findById(payload.userId);

      if (!user || user.refreshToken !== refreshToken) {
        throw { status: 401, message: 'Invalid refresh token' };
      }

      const newPayload: TokenPayload = { userId: user.id, email: user.email };
      const newAccessToken = JwtUtil.generateAccessToken(newPayload);
      const newRefreshToken = JwtUtil.generateRefreshToken(newPayload);

      await this.userRepository.updateRefreshToken(user.id, newRefreshToken);

      return { accessToken: newAccessToken, refreshToken: newRefreshToken };
    } catch (error) {
      throw { status: 401, message: 'Invalid refresh token' };
    }
  }

  public async logout(userId: string): Promise<void> {
    await this.userRepository.updateRefreshToken(userId, null);
  }
}
