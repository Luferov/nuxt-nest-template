import { InputType, PickType } from '@nestjs/graphql'
import { UserCreateInput } from '@generated/user'

@InputType()
export class UserLoginInput extends PickType(UserCreateInput, ['username', 'password'] as const) {}
