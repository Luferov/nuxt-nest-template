import * as Joi from 'joi'
import { Injectable, NotAcceptableException } from '@nestjs/common'
import { PrismaService } from '@common/services/prisma.service'
import { File } from '@generated/file'
import { User } from '@generated/user'
import { MinioService } from '@minio/minio.service'
import { FileUploadType } from '@files/dto/file-upload.type'
import { FileUploadInput } from '@files/dto/file-upload.input'

@Injectable()
export class FilesService {
  constructor(private readonly prismaService: PrismaService, private readonly minioService: MinioService) {}

  /**
   * Функция для добавления файла
   * @param uploadFile Загруженный с помощью minio файл
   * @param user Пользователь
   */
  async add(uploadFile: FileUploadInput, user?: User): Promise<File> {
    return this.prismaService.file.create({
      data: {
        name: uploadFile.fileName,
        key: uploadFile.name,
        bucket: this.minioService.getBucket(),
        userId: user?.id,
      },
    })
  }

  /**
   * Проверка правильности файлового имени
   * @param name
   */
  async checkFileName(name: string): Promise<boolean> {
    const nameSchema = Joi.string()
      .required()
      .pattern(/^(.+)\.[a-zA-Z0-9]{1,5}$/)
    try {
      await nameSchema.validateAsync(name)
      return true
    } catch (e) {
      return false
    }
  }

  /**
   * Получение ссылки на загрузку файла
   * @param fileName - имя предполагаемого файла
   */
  async getPresignedPutUrl(fileName: string): Promise<FileUploadType> {
    if (await this.checkFileName(fileName)) {
      const [bucket, name, presignedUrl] = await this.minioService.getPresignedPutUrl(fileName)
      return {
        fileName,
        bucket,
        name,
        presignedUrl,
      }
    }
    throw new NotAcceptableException('Неверное название файла')
  }
}
