import * as crypto from 'crypto'
import { BucketItemStat } from 'minio'
import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { InjectMinioClient } from '@minio/minio.decorators'
import { MinioClient } from '@minio/minio.interfaces'
import { ConfigService } from '@nestjs/config'
import { BufferedFileInterface } from '@minio/dto/buffered-file.interface'

@Injectable()
export class MinioService {
  private readonly bucket: string

  constructor(
    private readonly configService: ConfigService,
    @InjectMinioClient() private readonly minioClient: MinioClient
  ) {
    this.bucket = configService.get<string>('MINIO_BUCKET', 'bucket')
  }

  getBucket(): string {
    return this.bucket
  }

  async listBuckets() {
    return await this.minioClient.listBuckets()
  }

  /**
   * Загружаем файл в S3
   * @param file
   * @return objectName
   */
  async uploadObject(file: BufferedFileInterface): Promise<string> {
    const hashedFileName = crypto.createHash('md5').update(Date.now().toString()).digest('hex')
    const ext = file.filename.substring(file.filename.lastIndexOf('.'), file.filename.length)

    const objectName = `${hashedFileName}.${ext}`
    const metaData = {
      'Content-Type': file.mimetype,
    }
    try {
      await this.minioClient.putObject(this.bucket, objectName, file.buffer, metaData)
    } catch (e) {
      throw new HttpException(`Error put object to s3: ${e}`, HttpStatus.BAD_REQUEST)
    }
    return objectName
  }

  /**
   * Проверяем, если ли объект в s3
   * @param name
   * @return информацию или false - если файла нет
   */
  async existsObject(name: string): Promise<BucketItemStat | boolean> {
    try {
      return await this.minioClient.statObject(this.bucket, name)
    } catch {
      return false
    }
  }
}
