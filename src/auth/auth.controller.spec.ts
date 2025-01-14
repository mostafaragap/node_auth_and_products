import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from '../guards/auth.guard';
import { LoginUserDto, RegisterUserDto } from './dto';

describe('AuthController', () => {
  let authController: AuthController;
  let authService: AuthService;

  // Mocked AuthService
  const mockAuthService = {
    register: jest.fn(),
    login: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        { provide: AuthService, useValue: mockAuthService },
      ],
    })
      // Override the JwtAuthGuard so we don't actually require authentication
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: jest.fn(() => true) })
      .compile();

    authController = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(authController).toBeDefined();
  });

  describe('register', () => {
    it('should call authService.register with RegisterUserDto', async () => {
      const dto: RegisterUserDto = {
        email: 'test@example.com',
        password: 'Aa!123456',
        role: 'user',
      };
      const mockResult = { id: 1, email: dto.email, role: dto.role };
      mockAuthService.register.mockResolvedValue(mockResult);

      const result = await authController.register(dto);
      expect(authService.register).toHaveBeenCalledWith(dto);
      expect(result).toEqual(mockResult);
    });
  });

  describe('login', () => {
    it('should call authService.login with LoginUserDto', async () => {
      const dto: LoginUserDto = {
        email: 'test@example.com',
        password: 'Aa!123456',
      };
      const mockToken = { accessToken: 'jwtToken' };
      mockAuthService.login.mockResolvedValue(mockToken);

      const result = await authController.login(dto);
      expect(authService.login).toHaveBeenCalledWith(dto);
      expect(result).toEqual(mockToken);
    });
  });

  describe('getProtectedData', () => {
    it('should return the user from the request',async () => {
      // Since we've overridden JwtAuthGuard, it won't block the route.
      const user = { id: 1, email: 'test@example.com', role: 'user' };
      const result = await authController.getProfile(user);
      expect(result).toEqual(user);
    });
  });
});
