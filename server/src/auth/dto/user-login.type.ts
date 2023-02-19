import { Field, ObjectType } from '@nestjs/graphql'
import { User } from '@generated/user'

@ObjectType()
export class UserLoginType {
  @Field()
  accessToken: string

  @Field(() => User)
  user: User
}
