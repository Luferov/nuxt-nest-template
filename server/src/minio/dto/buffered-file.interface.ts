import { FileUpload } from 'graphql-upload/Upload'

export interface BufferedFileInterface extends Omit<FileUpload, 'createReadStream'> {
  buffer: Buffer | string
}
