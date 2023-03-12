import { Field, InputType } from '@nestjs/graphql'
import GraphQLUpload from 'graphql-upload/GraphQLUpload.js'
import { FileUpload } from '@files/dto/file-upload.interface'

@InputType()
export class ChangeAvatarInput {
  @Field(() => GraphQLUpload)
  image: Promise<FileUpload>
}
