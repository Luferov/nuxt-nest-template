import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Start seed operations')
  await prisma.$connect()
  // create dummy user
  // const user = await prisma.user.create({
  //   data: {
  //     email: 'saeedkargosha@gmail.com',
  //     password: '1234567890',
  //   },
  // })
  // console.log({ user })
  console.log('End seed operations')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
