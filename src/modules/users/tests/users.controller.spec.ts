import { Test, TestingModule } from '@nestjs/testing';
import { CreateUserDto } from '../model/dto/create-user.dto';
import { UserResponseDto } from '../model/dto/user-response.dto';
import { UsersController } from '../users.controller';
import { UsersService } from '../users.service';

const mockUsersService = () => ({
  createUser: jest.fn(),
});

type MockedUsersService = ReturnType<typeof mockUsersService>;

describe('UsersController', () => {
  let controller: UsersController;
  let service: MockedUsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        { provide: UsersService, useFactory: mockUsersService },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    service = module.get<MockedUsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('createUser', () => {
    it('should create a new user and return a response message', async () => {
      const dto: CreateUserDto = { email: 'test@example.com', password: 'password' };
      const userResponse: UserResponseDto = { id: '1', email: 'test@example.com' };

      service.createUser.mockResolvedValue(userResponse);

      const result = await controller.createUser(dto);

      expect(result).toEqual(userResponse);
      expect(service.createUser).toHaveBeenCalledWith(dto);
    });
  });
});