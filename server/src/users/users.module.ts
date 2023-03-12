import { Module } from '@nestjs/common'
import { UsersService } from './users.service'
import { UsersResolver } from './users.resolver'
import { PrismaService } from '@common/services/prisma.service'
import { FilesModule } from '@files/files.module'

@Module({
  imports: [FilesModule],
  providers: [PrismaService, UsersService, UsersResolver],
  exports: [UsersService],
})
export class UsersModule {}
