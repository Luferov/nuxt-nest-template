import { Inject, Injectable } from '@nestjs/common'
import { PrismaService } from '@common/services/prisma.service'
import { GraphQLError } from 'graphql'
import { JwtService } from '@nestjs/jwt'
import { UserLoginInput, UserLoginType, UserRegisterInput } from './dto'
import { User } from '@generated/user'
import type { Bcrypt, Passport } from './providers'
import { BCRYPT, PASSPORT } from './providers'
import { JwtPayload } from './strategies'
import { ConfigService } from '@nestjs/config'

@Injectable()
export class AuthService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    @Inject(BCRYPT) private readonly bcryptService: Bcrypt,
    @Inject(PASSPORT) private readonly passportService: Passport
  ) {}

  async login({ username, password }: UserLoginInput): Promise<UserLoginType> {
    const user = await this.validateUser(username, password)
    if (!user) {
      throw new GraphQLError('Неверный логин или пароль', {
        extensions: { code: 'FORBIDDEN' },
      })
    }
    const accessToken = await this.createJwtToken(user)
    return { accessToken, user }
  }

  async register(userDto: UserRegisterInput): Promise<UserLoginType> {
    const saltRounds = 10
    const password = await this.bcryptService.hash(userDto.password, saltRounds)
    const user = await this.prismaService.user.create({
      data: {
        ...userDto,
        password,
      },
    })
    const accessToken = await this.createJwtToken(user)
    return { accessToken, user }
  }

  async createJwtToken(user: User): Promise<string> {
    const payload: JwtPayload = {
      username: user.username,
      sub: user.id,
    }
    return await this.jwtService.signAsync(payload)
  }

  async validateUser(username: string, password: string): Promise<User | null> {
    const user = await this.prismaService.user.findUnique({
      where: { username },
    })
    if (!user) {
      return null
    }
    const valid = await this.bcryptService.compare(password, user.password)
    return valid ? user : null
  }
}
