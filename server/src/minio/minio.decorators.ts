import { Inject } from '@nestjs/common'
import { MINIO_CONNECTION } from '@minio/minio.constants'

/**
 * Inject minio client
 * @constructor
 */
export const InjectMinioClient = () => {
  return Inject(MINIO_CONNECTION)
}
