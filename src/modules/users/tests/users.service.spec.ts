import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';
import { User } from '../model/entity/user.entity';
import { UsersService } from '../users.service';

const mockUserRepository = () => ({
  create: jest.fn(),
  save: jest.fn(),
  findOne: jest.fn(),
  findOneBy: jest.fn(),
});

type MockRepository<T = any> = Partial<Record<keyof Repository<T>, jest.Mock>>;

describe('UsersService', () => {
  let service: UsersService;
  let repository: MockRepository<User>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        { provide: getRepositoryToken(User), useFactory: mockUserRepository },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    repository = module.get<MockRepository<User>>(getRepositoryToken(User));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createUser', () => {
    it('should create and save a new user', async () => {
      const dto = { email: 'test@example.com', password: 'password' };
      const user = { id: '1', ...dto };

      repository.create.mockReturnValue(user);
      repository.save.mockResolvedValue(user);

      expect(await service.createUser(dto)).toEqual(user);
      expect(repository.create).toHaveBeenCalledWith(dto);
      expect(repository.save).toHaveBeenCalledWith(user);
    });
  });

  describe('getUser', () => {
    it('should return a user by id', async () => {
      const id = '1';
      const user = { id, email: 'test@example.com', password: 'password' };

      repository.findOneBy.mockResolvedValue(user);

      expect(await service.getUser(id)).toEqual(user);
      expect(repository.findOneBy).toHaveBeenCalledWith({ id });
    });
  });

  describe('getUserByEmail', () => {
    it('should return a user by email', async () => {
      const email = 'test@example.com';
      const user = { id: '1', email, password: 'password' };

      repository.findOne.mockResolvedValue(user);

      expect(await service.getUserByEmail(email)).toEqual(user);
      expect(repository.findOne).toHaveBeenCalledWith({ where: { email } });
    });
  });

  describe('updateUser', () => {
    it('should update and save an existing user', async () => {
      const id = '1';
      const dto = { email: 'updated@example.com', password: 'newpassword' };
      const user = { id, email: 'test@example.com', password: 'password' };
      const updatedUser = { ...user, ...dto };

      repository.findOneBy.mockResolvedValue(user);
      repository.save.mockResolvedValue(updatedUser);

      expect(await service.updateUser(id, dto)).toEqual(updatedUser);
      expect(repository.findOneBy).toHaveBeenCalledWith({ id });
      expect(repository.save).toHaveBeenCalledWith(updatedUser);
    });
  })

    it('should throw a NotFoundException if user does not exist', async () => {
      const id = '1';
      const dto = { email: 'updated@example.com', password: 'newpassword' };

      repository.findOneBy.mockResolvedValue(null);

      await expect(service.updateUser(id, dto)).rejects.toThrow(NotFoundException);
      expect(repository.findOneBy).toHaveBeenCalledWith({ id });
    });
});