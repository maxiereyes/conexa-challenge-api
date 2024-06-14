import { ExecutionContext } from '@nestjs/common';
import { RolesGuard } from './roles.guard';
import { Reflector } from '@nestjs/core';
import { Test, TestingModule } from '@nestjs/testing';

describe('RolesGuard', () => {
  let rolesGuard: RolesGuard;
  let reflector: Reflector;
  let module: TestingModule;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      providers: [RolesGuard, Reflector],
    }).compile();

    rolesGuard = module.get<RolesGuard>(RolesGuard);
    reflector = module.get<Reflector>(Reflector);
  });

  it('should be defined', () => {
    expect(rolesGuard).toBeDefined();
    expect(reflector).toBeDefined();
  });

  it('should return true if no roles are required', () => {
    const mockContext = createMockContext({});

    jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(undefined);

    expect(rolesGuard.canActivate(mockContext)).toBe(true);
  });

  it('should return true if user has required roles', () => {
    const mockContext = createMockContext({ user: { roles: ['admin'] } });

    jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(['admin']);

    expect(rolesGuard.canActivate(mockContext)).toBe(true);
  });

  it('should return false if user does not have required roles', () => {
    const mockContext = createMockContext({ user: { roles: ['user'] } });

    jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(['admin']);

    expect(rolesGuard.canActivate(mockContext)).toBe(false);
  });

  it('should return true if user has one almost required roles', () => {
    const mockContext = createMockContext({
      user: { roles: ['admin', 'user'] },
    });

    jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(['admin']);

    expect(rolesGuard.canActivate(mockContext)).toBe(true);
  });

  afterAll(async () => {
    await module.close();
  });
});

function createMockContext(request: any): ExecutionContext {
  return {
    switchToHttp: () => ({
      getRequest: () => request,
    }),
    getHandler: () => ({}),
    getClass: () => ({}),
  } as ExecutionContext;
}
