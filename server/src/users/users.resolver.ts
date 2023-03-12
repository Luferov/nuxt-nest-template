import { Args, Mutation, Query, Resolver } from '@nestjs/graphql'
import { User } from '@generated/user'
import { UseGuards } from '@nestjs/common'
import { GqlAuthGuard } from '@auth/auth.guard'
import { CurrentUser } from '@auth/auth.decorators'
import { UsersService } from '@users/users.service'

import { FileUpload } from 'graphql-upload/Upload.js'
import GraphQLUpload from 'graphql-upload/GraphQLUpload.js'

@Resolver()
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}
  @UseGuards(GqlAuthGuard)
  @Query(() => User)
  async me(@CurrentUser() user: User): Promise<User> {
    return user
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => User)
  async uploadAvatar(
    @CurrentUser() user: User,
    @Args({ name: 'media', type: () => GraphQLUpload }) media: FileUpload
  ): Promise<User> {
    return this.usersService.updateAvatar(media, user)
  }
}
