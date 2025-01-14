import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UserRepository } from './repository/user.repository';
import { JwtService } from '@nestjs/jwt';
import { ConflictException, UnauthorizedException } from '@nestjs/common';
import { RegisterUserDto } from './dto/register-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import * as bcrypt from 'bcryptjs';

// 1. Create a mock repository with jest.fn().
const mockUserRepository = {
  findUserByEmail: jest.fn(),
  createUser: jest.fn(),
};

// 2. Create a mock JwtService.
const mockJwtService = {
  sign: jest.fn(),
};

describe('AuthService', () => {
  let authService: AuthService;
  let userRepository: typeof mockUserRepository; // We'll cast the injected repository to this type
  let jwtService: typeof mockJwtService;

  beforeEach(async () => {
    // 3. Create a testing module, overriding the real UserRepository and JwtService providers.
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UserRepository, useValue: mockUserRepository },
        { provide: JwtService, useValue: mockJwtService },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);

    // 4. Cast the injected UserRepository to our mock type to get mockResolvedValue, etc.
    userRepository = module.get<UserRepository>(UserRepository) as unknown as typeof mockUserRepository;
    jwtService = module.get<JwtService>(JwtService) as unknown as typeof mockJwtService;
  });

  afterEach(() => {
    // Reset all mocks between tests to avoid cross-test contamination.
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(authService).toBeDefined();
  });

  describe('register', () => {
    it('should create a new user if email does not exist', async () => {
      const dto: RegisterUserDto = {
        email: 'test@example.com',
        password: 'Aa!123456',
        role: 'admin',
      };

      // Mock: user not found
      userRepository.findUserByEmail.mockResolvedValue(null);

      // Mock: user is created
      userRepository.createUser.mockResolvedValue({
        id: 1,
        email: dto.email,
        password: 'hashedPassword',
        role: dto.role,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const result = await authService.register(dto);

      expect(userRepository.findUserByEmail).toHaveBeenCalledWith('test@example.com');
      expect(userRepository.createUser).toHaveBeenCalled();
      expect(result).toMatchObject({ email: dto.email, role: 'admin' });
    });

    it('should throw ConflictException if user already exists', async () => {
      const dto: RegisterUserDto = {
        email: 'exists@example.com',
        password: 'Aa!123456',
        role: 'user',
      };

      // Mock: user found
      userRepository.findUserByEmail.mockResolvedValue({
        id: 2,
        email: dto.email,
        password: 'someHashedPassword',
        role: 'user',
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      await expect(authService.register(dto)).rejects.toThrow(ConflictException);
      expect(userRepository.findUserByEmail).toHaveBeenCalledWith(dto.email);
      expect(userRepository.createUser).not.toHaveBeenCalled();
    });
  });

  describe('login', () => {
    it('should throw UnauthorizedException if user not found', async () => {
      const dto: LoginUserDto = {
        email: 'nonexistent@example.com',
        password: 'somePassword',
      };

      userRepository.findUserByEmail.mockResolvedValue(null);

      await expect(authService.login(dto)).rejects.toThrow(UnauthorizedException);
      expect(userRepository.findUserByEmail).toHaveBeenCalledWith(dto.email);
    });

    it('should throw UnauthorizedException if password is invalid', async () => {
      const dto: LoginUserDto = {
        email: 'test@example.com',
        password: 'invalidPassword',
      };

      userRepository.findUserByEmail.mockResolvedValue({
        id: 1,
        email: dto.email,
        password: 'hashedPassword',
        role: 'user',
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      jest.spyOn(bcrypt, 'compare').mockResolvedValueOnce(false);

      await expect(authService.login(dto)).rejects.toThrow(UnauthorizedException);
      expect(userRepository.findUserByEmail).toHaveBeenCalledWith(dto.email);
    });

    it('should return an access token if credentials are valid', async () => {
      const dto: LoginUserDto = {
        email: 'test@example.com',
        password: 'validPassword',
      };

      userRepository.findUserByEmail.mockResolvedValue({
        id: 3,
        email: dto.email,
        password: 'hashedPassword',
        role: 'user',
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      // Mock password match
      jest.spyOn(bcrypt, 'compare').mockResolvedValueOnce(true);

      // Mock JWT sign
      jwtService.sign.mockReturnValue('jwt_token');

      const result = await authService.login(dto);

      expect(userRepository.findUserByEmail).toHaveBeenCalledWith(dto.email);
      expect(jwtService.sign).toHaveBeenCalledWith({ sub: 3, role: 'user' });
      expect(result).toEqual({ accessToken: 'jwt_token' });
    });
  });

  describe('hashPassword', () => {
    it('should hash the password using bcrypt', async () => {
      jest.spyOn(bcrypt, 'hash').mockResolvedValueOnce('hashedPassword');
      const plainPassword = 'mySecretPass';

      const result = await authService.hashPassword(plainPassword);
      expect(result).toBe('hashedPassword');
      expect(bcrypt.hash).toHaveBeenCalledWith(plainPassword, 10);
    });
  });

  describe('validatePassword', () => {
    it('should validate password using bcrypt.compare', async () => {
      jest.spyOn(bcrypt, 'compare').mockResolvedValueOnce(true);

      const isValid = await authService.validatePassword('plain', 'hashed');
      expect(isValid).toBe(true);
      expect(bcrypt.compare).toHaveBeenCalledWith('plain', 'hashed');
    });
  });
});
