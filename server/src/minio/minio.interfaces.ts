import { ModuleMetadata, Type } from '@nestjs/common/interfaces'
import * as MinioJS from 'minio'

export type MinioClient = MinioJS.Client
export type MinioModuleOptions = MinioJS.ClientOptions

export interface MinioModuleOptionsFactory {
  createMinioModuleOptions(): Promise<MinioJS.ClientOptions> | MinioJS.ClientOptions
}

export interface MinioModuleAsyncOptions extends Pick<ModuleMetadata, 'imports'> {
  inject?: any[]
  useClass?: Type<MinioModuleOptionsFactory>
  useExisting?: Type<MinioModuleOptionsFactory>
  useFactory?: (...args: any[]) => Promise<MinioJS.ClientOptions> | MinioJS.ClientOptions
}
