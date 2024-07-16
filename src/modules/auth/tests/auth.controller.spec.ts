import { Test, TestingModule } from '@nestjs/testing';
import { CreateUserDto } from '../../users/model/dto/create-user.dto';
import { User } from '../../users/model/entity/user.entity';
import { AuthController } from '../auth.controller';
import { AuthService } from '../auth.service';
import { RefreshTokenGuard } from '../guard/refresh_token.guard';
import { LoginDto } from '../model/dto/login.dto';


const mockAuthService = () => ({
  signUp: jest.fn(),
  login: jest.fn(),
  refreshToken: jest.fn(),
});

type MockAuthService = ReturnType<typeof mockAuthService>;

const mockRefreshTokenGuard = jest.fn().mockImplementation(() => true);
const mockCurrentUser = jest.fn().mockImplementation(() => ({ id: '1', email: 'test@example.com' }));

describe('AuthController', () => {
  let controller: AuthController;
  let service: MockAuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        { provide: AuthService, useFactory: mockAuthService },
      ],
    })
    .overrideGuard(RefreshTokenGuard)
    .useValue(mockRefreshTokenGuard)
    .overrideProvider(User)
    .useValue(mockCurrentUser)
    .compile();

    controller = module.get<AuthController>(AuthController);
    service = module.get<MockAuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('signUp', () => {
    it('should sign up a new user and return tokens', async () => {
      const dto: CreateUserDto = { email: 'test@example.com', password: 'password' };
      const tokens = { accessToken: 'accessToken', refreshToken: 'refreshToken' };

      service.signUp.mockResolvedValue({ tokens });

      const result = await controller.signUp(dto);

      expect(result).toEqual({ tokens });
      expect(service.signUp).toHaveBeenCalledWith(dto);
    });
  });

  describe('login', () => {
    it('should log in a user and return user and tokens', async () => {
      const dto: LoginDto = { email: 'test@example.com', password: 'password' };
      const user = { id: '1', email: 'test@example.com', password: 'hashedPassword' };
      const tokens = { accessToken: 'accessToken', refreshToken: 'refreshToken' };

      service.login.mockResolvedValue({ user, tokens });

      const result = await controller.login(dto);

      expect(result).toEqual({ user, tokens });
      expect(service.login).toHaveBeenCalledWith(dto);
    });
  });

  describe('refreshToken', () => {
    it('should refresh token and return new access token', async () => {
      const user: User = { id: '1', email: 'test@example.com', password: 'hashedPassword', refreshToken: 'refreshToken' } as User;
      const newAccessToken = { accessToken: 'newAccessToken' };

      service.refreshToken.mockResolvedValue(newAccessToken);

      const result = await controller.refreshToken(user);

      expect(result).toEqual(newAccessToken);
      expect(service.refreshToken).toHaveBeenCalledWith(user);
    });
  });
});