import { Test, TestingModule } from '@nestjs/testing';
import { UserRepository } from './user.repository';
import { PrismaService } from '../../prisma/prisma.service';
import { User } from '@prisma/client';

describe('UserRepository', () => {
  let repository: UserRepository;
  let prisma: PrismaService;

  const mockPrismaService = {
    user: {
      create: jest.fn(),
      findUnique: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserRepository,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    repository = module.get<UserRepository>(UserRepository);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(repository).toBeDefined();
  });

  describe('createUser', () => {
    it('should create a new user', async () => {
      const mockUser: User = {
        id: 1,
        email: 'test@example.com',
        password: 'hashedPassword',
        role: 'user',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const email = 'test@example.com';
      const password = 'hashedPassword';
      const role = 'user';

      mockPrismaService.user.create.mockResolvedValue(mockUser);

      const result = await repository.createUser(email, password, role);

      expect(result).toEqual(mockUser);
      expect(prisma.user.create).toHaveBeenCalledWith({
        data: { email, password, role },
      });
    });
  });

  describe('findUserByEmail', () => {
    it('should find a user by email', async () => {
      const mockUser: User = {
        id: 1,
        email: 'test@example.com',
        password: 'hashedPassword',
        role: 'user',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrismaService.user.findUnique.mockResolvedValue(mockUser);

      const email = 'test@example.com';
      const result = await repository.findUserByEmail(email);

      expect(result).toEqual(mockUser);
      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: { email },
      });
    });

    it('should return null if no user is found', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(null);

      const email = 'nonexistent@example.com';
      const result = await repository.findUserByEmail(email);

      expect(result).toBeNull();
      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: { email },
      });
    });
  });

  describe('findUserById', () => {
    it('should find a user by ID', async () => {
      const mockUser: User = {
        id: 1,
        email: 'test@example.com',
        password: 'hashedPassword',
        role: 'user',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrismaService.user.findUnique.mockResolvedValue(mockUser);

      const id = 1;
      const result = await repository.findUserById(id);

      expect(result).toEqual(mockUser);
      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: { id },
      });
    });

    it('should return null if no user is found by ID', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(null);

      const id = 999;
      const result = await repository.findUserById(id);

      expect(result).toBeNull();
      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: { id },
      });
    });
  });
});
