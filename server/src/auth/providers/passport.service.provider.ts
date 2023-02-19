import { FactoryProvider } from '@nestjs/common'
import * as passport from 'passport'

export const PASSPORT = Symbol('PASSPORT')
export type Passport = passport.Authenticator

export const passportServiceProvider: FactoryProvider = {
  provide: PASSPORT,
  useFactory: (): Passport => {
    return passport
  },
}
