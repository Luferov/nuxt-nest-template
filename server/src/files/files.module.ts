import { Module } from '@nestjs/common'
import { MinioModule } from '@minio/minio.module'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { PrismaService } from '@common/services/prisma.service'

import { FilesResolver } from './files.resolver'
import { FilesService } from './files.service'

@Module({
  imports: [
    MinioModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => ({
        accessKey: config.get<string>('MINIO_ROOT_USER'),
        secretKey: config.get<string>('MINIO_ROOT_PASSWORD'),
        endPoint: config.get<string>('MINIO_END_POINT'),
        port: Number(config.get<number>('MINIO_PORT', 9000)),
        useSSL: false,
      }),
      inject: [ConfigService],
    }),
    ConfigModule,
  ],
  providers: [FilesResolver, FilesService, PrismaService],
  exports: [FilesResolver, FilesService],
})
export class FilesModule {}
