import { Injectable } from '@nestjs/common'
import { InjectMinioClient } from '@minio/minio.decorators'
import { MinioClient } from '@minio/minio.interfaces'
import { ConfigService } from '@nestjs/config'

@Injectable()
export class MinioService {
  private bucket: string

  constructor(
    private readonly configService: ConfigService,
    @InjectMinioClient() private readonly minioClient: MinioClient
  ) {
    this.bucket = configService.get<string>('MINIO_BUCKET', 'bucket')
  }

  async listBuckets() {
    return await this.minioClient.listBuckets()
  }
}
