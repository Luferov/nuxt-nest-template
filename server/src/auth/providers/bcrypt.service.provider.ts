import { FactoryProvider } from '@nestjs/common'

import * as bcrypt from 'bcrypt'

export const BCRYPT = Symbol('BCRYPT')
export type Bcrypt = typeof bcrypt

export const bcryptServiceProvider: FactoryProvider = {
  provide: BCRYPT,
  useFactory: (): Bcrypt => {
    return bcrypt
  },
}
