import { DynamicModule, FactoryProvider, Module, Provider } from '@nestjs/common'
import { MinioModuleAsyncOptions, MinioModuleOptions, MinioModuleOptionsFactory } from './minio.interfaces'
import { MINIO_CONNECTION, MINIO_OPTIONS } from '@minio/minio.constants'
import { createMinioConnection } from '@minio/minio.utils'
import { MinioService } from '@minio/minio.service'

@Module({
  providers: [MinioService],
  exports: [MinioService],
})
export class MinioModule {
  public static forRoot(options: MinioModuleOptions): DynamicModule {
    const minioOptionsProvider: Provider = {
      provide: MINIO_OPTIONS,
      useValue: options,
    }

    const minioConnectionProvider: Provider = {
      provide: MINIO_CONNECTION,
      useValue: createMinioConnection(options),
    }

    return {
      module: MinioModule,
      providers: [minioOptionsProvider, minioConnectionProvider, MinioService],
      exports: [minioOptionsProvider, minioConnectionProvider, MinioService],
    }
  }

  public static forRootAsync(options: MinioModuleAsyncOptions): DynamicModule {
    const minioConnectionProvider: FactoryProvider = {
      provide: MINIO_CONNECTION,
      useFactory(options: MinioModuleOptions) {
        return createMinioConnection(options)
      },
      inject: [MINIO_OPTIONS],
    }

    return {
      module: MinioModule,
      imports: options.imports,
      providers: [...this.createAsyncProviders(options), minioConnectionProvider, MinioService],
      exports: [minioConnectionProvider, MinioService],
    }
  }

  /* createAsyncProviders */
  public static createAsyncProviders(options: MinioModuleAsyncOptions): Provider[] {
    if (!(options.useExisting || options.useFactory || options.useClass)) {
      throw new Error('Invalid configuration. Must provide useFactory, useClass or useExisting')
    }

    if (options.useExisting || options.useFactory) {
      return [this.createAsyncOptionsProvider(options)]
    }

    return [this.createAsyncOptionsProvider(options), { provide: options.useClass, useClass: options.useClass }]
  }

  /* createAsyncOptionsProvider */
  public static createAsyncOptionsProvider(options: MinioModuleAsyncOptions): Provider {
    if (!(options.useExisting || options.useFactory || options.useClass)) {
      throw new Error('Invalid configuration. Must provide useFactory, useClass or useExisting')
    }

    if (options.useFactory) {
      return {
        provide: MINIO_OPTIONS,
        useFactory: options.useFactory,
        inject: options.inject || [],
      }
    }

    return {
      provide: MINIO_OPTIONS,
      async useFactory(optionsFactory: MinioModuleOptionsFactory): Promise<MinioModuleOptions> {
        return optionsFactory.createMinioModuleOptions()
      },
      inject: [options.useClass || options.useExisting],
    }
  }
}
