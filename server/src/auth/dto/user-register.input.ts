import { Field, InputType, PickType } from '@nestjs/graphql'
import { UserCreateInput } from '@generated/user'

@InputType()
export class UserRegisterInput extends PickType(UserCreateInput, [
  'username',
  'email',
  'lastName',
  'firstName',
  'sirName',
  'password',
] as const) {
  @Field(() => Date, { nullable: true, description: 'Date of birthday ' })
  birthday?: Date | string
}
