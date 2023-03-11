import { Injectable } from '@nestjs/common'
import { InjectMinioClient } from '@minio/minio.decorators'
import { MinioClient } from '@minio/minio.interfaces'

@Injectable()
export class FilesService {
  constructor(@InjectMinioClient() private readonly minioClient: MinioClient) {}

  async listBuckets() {
    return await this.minioClient.listBuckets()
  }
}
