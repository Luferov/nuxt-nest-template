import { ExtractJwt, Strategy } from 'passport-jwt'
import { Injectable } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { ConfigService } from '@nestjs/config'
import { User } from '@generated/user'
import { UsersService } from '@users/users.service'

export interface JwtPayload {
  username: string
  sub: number
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly usersService: UsersService, private readonly config: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: config.get<string>('SECRET_KEY'),
    })
  }

  async validate({ username }: JwtPayload): Promise<User> {
    return await this.usersService.findOne(username)
  }
}
