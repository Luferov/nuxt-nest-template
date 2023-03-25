import { Field, InputType } from '@nestjs/graphql'

@InputType()
export class FileUploadInput {
  @Field()
  fileName: string

  @Field()
  bucket: string

  @Field()
  name: string
}
