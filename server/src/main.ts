import { NestFactory } from '@nestjs/core'
import { Logger, ValidationPipe } from '@nestjs/common'
// import helmet from 'helmet'
import { AppModule } from './app.module'
import { PrismaService } from '@common/services/prisma.service'

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { logger: new Logger() })
  const prismaService = app.get(PrismaService)
  await prismaService.enableShutdownHooks(app)

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      disableErrorMessages: true,
    })
  )

  const port = process.env.PORT || 8000

  await app.listen(port)

  Logger.log(`🚀 Application is running on: http://localhost:${port}/`)
}
bootstrap()
