import { Args, Mutation, Resolver } from '@nestjs/graphql'
import { UseGuards } from '@nestjs/common'
import { User } from '@generated/user'
import { AuthService } from './auth.service'
import { LocalAuthGuard } from './auth.guard'
import { UserLoginInput, UserLoginType, UserRegisterInput } from './dto'
import { CurrentUser } from '@auth/auth.decorators'

@Resolver(() => User)
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Mutation(() => UserLoginType)
  @UseGuards(LocalAuthGuard)
  async login(
    @Args('userLoginInput') userLoginInput: UserLoginInput,
    @CurrentUser() user: User
  ): Promise<UserLoginType> {
    return {
      accessToken: await this.authService.createJwtToken(user),
      user,
    }
  }

  @Mutation(() => UserLoginType, { nullable: true })
  async register(@Args('userRegisterInput') userRegisterInput: UserRegisterInput): Promise<UserLoginType> {
    return await this.authService.register(userRegisterInput)
  }
}
