import { MinioClient } from './minio.interfaces'
import * as MinioJS from 'minio'

export function createMinioConnection(config: MinioJS.ClientOptions): MinioClient {
  return new MinioJS.Client(config)
}
