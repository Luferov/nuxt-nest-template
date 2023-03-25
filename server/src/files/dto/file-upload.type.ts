import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class FileUploadType {
  @Field()
  fileName: string

  @Field()
  bucket: string

  @Field()
  name: string

  @Field()
  presignedUrl: string
}
