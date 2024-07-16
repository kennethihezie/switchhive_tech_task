import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { BadRequestException, ForbiddenException, NotFoundException } from '@nestjs/common';
import { Helpers } from '../../../common/utils/helpers';
import { Configuration } from '../../configuration/configuration';
import { CreateUserDto } from '../../users/model/dto/create-user.dto';
import { User } from '../../users/model/entity/user.entity';
import { UsersService } from '../../users/users.service';
import { AuthService } from '../auth.service';
import { LoginDto } from '../model/dto/login.dto';

jest.mock('../../../common/utils/helpers');

const mockUsersService = () => ({
  createUser: jest.fn(),
  getUserByEmail: jest.fn(),
  updateUser: jest.fn(),
});

const mockJwtService = () => ({
  signAsync: jest.fn(),
});

const mockConfig = {
  env: {
    jwt: {
      jwtSecret: 'secret',
      jwtRefreshSecret: 'refreshSecret',
    },
  },
};

type MockUsersService = ReturnType<typeof mockUsersService>;
type MockJwtService = ReturnType<typeof mockJwtService>;

describe('AuthService', () => {
  let service: AuthService;
  let usersService: MockUsersService;
  let jwtService: MockJwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersService, useFactory: mockUsersService },
        { provide: JwtService, useFactory: mockJwtService },
        { provide: Configuration, useValue: mockConfig },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    usersService = module.get<MockUsersService>(UsersService);
    jwtService = module.get<MockJwtService>(JwtService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('signUp', () => {
    it('should hash password, create user, and return tokens', async () => {
      const dto: CreateUserDto = { email: 'test@example.com', password: 'password' };
      const user: User = { id: '1', email: 'test@example.com', password: 'hashedPassword' } as User;

      (Helpers.hashData as jest.Mock).mockResolvedValue('hashedPassword');
      usersService.createUser.mockResolvedValue(user);
      jest.spyOn(service, 'updateTokens').mockResolvedValue({
        user,
        accessToken: 'accessToken',
        refreshToken: 'refreshToken',
      });

      const result = await service.signUp(dto);

      expect(result).toEqual({ tokens: { accessToken: 'accessToken', refreshToken: 'refreshToken' } });
      expect(Helpers.hashData).toHaveBeenCalledWith(dto.password);
      expect(usersService.createUser).toHaveBeenCalledWith({ ...dto, password: 'hashedPassword' });
      expect(service.updateTokens).toHaveBeenCalledWith(user);
    });
  });

  describe('login', () => {
    it('should return user and tokens if login is successful', async () => {
      const dto: LoginDto = { email: 'test@example.com', password: 'password' };
      const user: User = { id: '1', email: 'test@example.com', password: 'hashedPassword' } as User;

      usersService.getUserByEmail.mockResolvedValue(user);
      (Helpers.verifyData as jest.Mock).mockResolvedValue(true);
      jest.spyOn(service, 'updateTokens').mockResolvedValue({
        user,
        accessToken: 'accessToken',
        refreshToken: 'refreshToken',
      });

      const result = await service.login(dto);

      expect(result).toEqual({ user, tokens: { accessToken: 'accessToken', refreshToken: 'refreshToken' } });
      expect(usersService.getUserByEmail).toHaveBeenCalledWith(dto.email);
      expect(Helpers.verifyData).toHaveBeenCalledWith(user.password, dto.password);
      expect(service.updateTokens).toHaveBeenCalledWith(user);
    });

    it('should throw NotFoundException if user does not exist', async () => {
      const dto: LoginDto = { email: 'test@example.com', password: 'password' };

      usersService.getUserByEmail.mockResolvedValue(null);

      await expect(service.login(dto)).rejects.toThrow(NotFoundException);
    });

    it('should throw BadRequestException if password is incorrect', async () => {
      const dto: LoginDto = { email: 'test@example.com', password: 'password' };
      const user: User = { id: '1', email: 'test@example.com', password: 'hashedPassword' } as User;

      usersService.getUserByEmail.mockResolvedValue(user);
      (Helpers.verifyData as jest.Mock).mockResolvedValue(false);

      await expect(service.login(dto)).rejects.toThrow(BadRequestException);
    });
  });

  describe('refreshToken', () => {
    it('should return new access token if user has refresh token', async () => {
      const user: User = { id: '1', email: 'test@example.com', password: 'hashedPassword', refreshToken: 'refreshToken' } as User;

      jest.spyOn(service, 'updateTokens').mockResolvedValue({
        user,
        accessToken: 'accessToken',
        refreshToken: 'newRefreshToken',
      });

      const result = await service.refreshToken(user);

      expect(result).toEqual({ accessToken: 'accessToken' });
      expect(service.updateTokens).toHaveBeenCalledWith(user);
    });

    it('should throw ForbiddenException if user does not have refresh token', async () => {
      const user: User = { id: '1', email: 'test@example.com', password: 'hashedPassword' } as User;

      await expect(service.refreshToken(user)).rejects.toThrow(ForbiddenException);
    });
  });

  describe('updateTokens', () => {
    it('should generate and return new access and refresh tokens', async () => {
      const user: User = { id: '1', email: 'test@example.com', password: 'hashedPassword' } as User;

      jwtService.signAsync.mockResolvedValueOnce('accessToken').mockResolvedValueOnce('refreshToken');
      usersService.updateUser.mockResolvedValue(user);

      const result = await service.updateTokens(user);

      expect(result).toEqual({
        user,
        accessToken: 'accessToken',
        refreshToken: 'refreshToken',
      });
      expect(jwtService.signAsync).toHaveBeenCalledWith(
        { sub: user.id, email: user.email },
        { secret: mockConfig.env.jwt.jwtSecret, expiresIn: '1d' },
      );
      expect(jwtService.signAsync).toHaveBeenCalledWith(
        { sub: user.id, email: user.email },
        { secret: mockConfig.env.jwt.jwtRefreshSecret, expiresIn: '7d' },
      );
      expect(usersService.updateUser).toHaveBeenCalledWith(user.id, { accessToken: 'accessToken', refreshToken: 'refreshToken' });
    });
  });
});