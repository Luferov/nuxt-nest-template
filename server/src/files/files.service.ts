import { ReadStream } from 'fs'
import { FileUpload } from 'graphql-upload/Upload'
import { Injectable, NotAcceptableException } from '@nestjs/common'
import { PrismaService } from '@common/services/prisma.service'
import { File } from '@generated/file'
import { User } from '@generated/user'
import { MinioService } from '@minio/minio.service'
import { stream2buffer } from '@files/utils'

@Injectable()
export class FilesService {
  constructor(private readonly prismaService: PrismaService, private readonly minioService: MinioService) {}

  /**
   * Функция для добавления файла
   * @param user Пользователь
   * @param media
   */
  async add(media: FileUpload, user?: User): Promise<File> {
    if (!media.createReadStream) {
      throw new NotAcceptableException('Необходимо загрузить файл')
    }
    const mediaBuffer = await stream2buffer(media.createReadStream() as unknown as ReadStream)
    const objectName = await this.minioService.uploadObject({ ...media, buffer: mediaBuffer })
    return this.prismaService.file.create({
      data: {
        name: media.filename,
        key: objectName,
        bucket: this.minioService.getBucket(),
        mimetype: media.mimetype,
        userId: user?.id,
      },
    })
  }
}
