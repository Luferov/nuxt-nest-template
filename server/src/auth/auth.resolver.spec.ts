import { Test, TestingModule } from '@nestjs/testing'
import { PrismaService } from '@common/services/prisma.service'
import { JwtService } from '@nestjs/jwt'
import { ConfigService } from '@nestjs/config'

import { AuthResolver } from './auth.resolver'
import { AuthService } from './auth.service'
import { bcryptServiceProvider, passportServiceProvider } from './providers'

describe('AuthResolver', () => {
  let resolver: AuthResolver

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthResolver,
        AuthService,
        PrismaService,
        JwtService,
        ConfigService,
        bcryptServiceProvider,
        passportServiceProvider,
      ],
    }).compile()

    resolver = module.get<AuthResolver>(AuthResolver)
  })

  it('should be defined', () => {
    expect(resolver).toBeDefined()
  })
})
