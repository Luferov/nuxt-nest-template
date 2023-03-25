import { Args, Query, Resolver } from '@nestjs/graphql'
import { FilesService } from '@files/files.service'
import { FileUploadType } from '@files/dto/file-upload.type'

@Resolver()
export class FilesResolver {
  constructor(private readonly filesService: FilesService) {}
  @Query(() => FileUploadType)
  async presignedPutUrl(@Args({ name: 'fileName', type: () => String }) fileName: string): Promise<FileUploadType> {
    return await this.filesService.getPresignedPutUrl(fileName)
  }
}
