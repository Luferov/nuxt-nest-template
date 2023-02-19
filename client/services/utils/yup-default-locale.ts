const toString = Object.prototype.toString
const errorToString = Error.prototype.toString
const regExpToString = RegExp.prototype.toString
const symbolToString = typeof Symbol !== 'undefined' ? Symbol.prototype.toString : () => ''

const SYMBOL_REGEXP = /^Symbol\((.*)\)(.*)$/

function printNumber(val: any) {
  if (val != +val) return 'NaN'
  const isNegativeZero = val === 0 && 1 / val < 0
  return isNegativeZero ? '-0' : '' + val
}

function printSimpleValue(val: any, quoteStrings = false) {
  if (val == null || val === true || val === false) return '' + val

  const typeOf = typeof val
  if (typeOf === 'number') return printNumber(val)
  if (typeOf === 'string') return quoteStrings ? `"${val}"` : val
  if (typeOf === 'function') return '[Function ' + (val.name || 'anonymous') + ']'
  if (typeOf === 'symbol') return symbolToString.call(val).replace(SYMBOL_REGEXP, 'Symbol($1)')

  const tag = toString.call(val).slice(8, -1)
  if (tag === 'Date') return isNaN(val.getTime()) ? '' + val : val.toISOString(val)
  if (tag === 'Error' || val instanceof Error) return '[' + errorToString.call(val) + ']'
  if (tag === 'RegExp') return regExpToString.call(val)

  return null
}

function printValue(value: any, quoteStrings?: boolean) {
  const result = printSimpleValue(value, quoteStrings)
  if (result !== null) return result

  return JSON.stringify(
    value,
    function (key, value) {
      const result = printSimpleValue(this[key], quoteStrings)
      if (result !== null) return result
      return value
    },
    2
  )
}

export type SchemaSpec<TDefault> = {
  coerce: boolean
  nullable: boolean
  optional: boolean
  default?: TDefault | (() => TDefault)
  abortEarly?: boolean
  strip?: boolean
  strict?: boolean
  recursive?: boolean
  label?: string | undefined
  meta?: any
}

export interface MessageParams {
  path: string
  value: any
  originalValue: any
  label: string
  type: string
  spec: SchemaSpec<any> & Record<string, unknown>
}

export type Message<Extra extends Record<string, unknown> = any> =
  | string
  | ((params: Extra & MessageParams) => unknown)
  | Record<PropertyKey, unknown>

function toArray<T>(value?: null | T | readonly T[]) {
  return value == null ? [] : ([] as T[]).concat(value)
}

const strReg = /\$\{\s*(\w+)\s*\}/g

type Params = Record<string, unknown>

class ValidationError extends Error {
  value: any
  path?: string
  type?: string
  errors: string[]

  params?: Params

  inner: ValidationError[]

  static formatError(message: string | ((params: Params) => string) | unknown, params: Params) {
    const path = params.label || params.path || 'this'
    if (path !== params.path) params = { ...params, path }

    if (typeof message === 'string') return message.replace(strReg, (_, key) => printValue(params[key]))
    if (typeof message === 'function') return message(params)

    return message
  }

  static isError(err: any): err is ValidationError {
    return err && err.name === 'ValidationError'
  }

  constructor(
    errorOrErrors: string | ValidationError | readonly ValidationError[],
    value?: any,
    field?: string,
    type?: string
  ) {
    super()

    this.name = 'ValidationError'
    this.value = value
    this.path = field
    this.type = type

    this.errors = []
    this.inner = []

    toArray(errorOrErrors).forEach((err) => {
      if (ValidationError.isError(err)) {
        this.errors.push(...err.errors)
        this.inner = this.inner.concat(err.inner.length ? err.inner : err)
      } else {
        this.errors.push(err)
      }
    })

    this.message = this.errors.length > 1 ? `${this.errors.length} errors occurred` : this.errors[0]

    if (Error.captureStackTrace) Error.captureStackTrace(this, ValidationError)
  }
}

export interface MixedLocale {
  default?: Message
  required?: Message
  oneOf?: Message<{ values: any }>
  notOneOf?: Message<{ values: any }>
  notNull?: Message
  notType?: Message
  defined?: Message
}

export interface StringLocale {
  length?: Message<{ length: number }>
  min?: Message<{ min: number }>
  max?: Message<{ max: number }>
  matches?: Message<{ regex: RegExp }>
  email?: Message<{ regex: RegExp }>
  url?: Message<{ regex: RegExp }>
  uuid?: Message<{ regex: RegExp }>
  trim?: Message
  lowercase?: Message
  uppercase?: Message
}

export interface NumberLocale {
  min?: Message<{ min: number }>
  max?: Message<{ max: number }>
  lessThan?: Message<{ less: number }>
  moreThan?: Message<{ more: number }>
  positive?: Message<{ more: number }>
  negative?: Message<{ less: number }>
  integer?: Message
}

export interface DateLocale {
  min?: Message<{ min: Date | string }>
  max?: Message<{ max: Date | string }>
}

export interface ObjectLocale {
  noUnknown?: Message
}

export interface ArrayLocale {
  length?: Message<{ length: number }>
  min?: Message<{ min: number }>
  max?: Message<{ max: number }>
}

export interface TupleLocale {
  notType?: Message
}

export interface BooleanLocale {
  isValue?: Message
}

export interface LocaleObject {
  mixed?: MixedLocale
  string?: StringLocale
  number?: NumberLocale
  date?: DateLocale
  boolean?: BooleanLocale
  object?: ObjectLocale
  array?: ArrayLocale
}

export const mixed: Required<MixedLocale> = {
  default: '${path} is invalid',
  required: '${path} is a required field',
  defined: '${path} must be defined',
  notNull: '${path} cannot be null',
  oneOf: '${path} must be one of the following values: ${values}',
  notOneOf: '${path} must not be one of the following values: ${values}',
  notType: ({ path, type, value, originalValue }) => {
    const castMsg =
      originalValue != null && originalValue !== value
        ? ` (cast from the value \`${printValue(originalValue, true)}\`).`
        : '.'

    return type !== 'mixed'
      ? `${path} must be a \`${type}\` type, ` + `but the final value was: \`${printValue(value, true)}\`` + castMsg
      : `${path} must match the configured type. ` + `The validated value was: \`${printValue(value, true)}\`` + castMsg
  },
}

export const string: Required<StringLocale> = {
  length: '${path} must be exactly ${length} characters',
  min: '${path} must be at least ${min} characters',
  max: '${path} must be at most ${max} characters',
  matches: '${path} must match the following: "${regex}"',
  email: '${path} must be a valid email',
  url: '${path} must be a valid URL',
  uuid: '${path} must be a valid UUID',
  trim: '${path} must be a trimmed string',
  lowercase: '${path} must be a lowercase string',
  uppercase: '${path} must be a upper case string',
}

export const number: Required<NumberLocale> = {
  min: '${path} must be greater than or equal to ${min}',
  max: '${path} must be less than or equal to ${max}',
  lessThan: '${path} must be less than ${less}',
  moreThan: '${path} must be greater than ${more}',
  positive: '${path} must be a positive number',
  negative: '${path} must be a negative number',
  integer: '${path} must be an integer',
}

export const date: Required<DateLocale> = {
  min: '${path} field must be later than ${min}',
  max: '${path} field must be at earlier than ${max}',
}

export const boolean: BooleanLocale = {
  isValue: '${path} field must be ${value}',
}

export const object: Required<ObjectLocale> = {
  noUnknown: '${path} field has unspecified keys: ${unknown}',
}

export const array: Required<ArrayLocale> = {
  min: '${path} field must have at least ${min} items',
  max: '${path} field must have less than or equal to ${max} items',
  length: '${path} must have ${length} items',
}

export const tuple: Required<TupleLocale> = {
  notType: (params) => {
    const { path, value, spec } = params
    const typeLen = spec.types.length
    if (Array.isArray(value)) {
      if (value.length < typeLen)
        return `${path} tuple value has too few items, expected a length of ${typeLen} but got ${
          value.length
        } for value: \`${printValue(value, true)}\``
      if (value.length > typeLen)
        return `${path} tuple value has too many items, expected a length of ${typeLen} but got ${
          value.length
        } for value: \`${printValue(value, true)}\``
    }

    return ValidationError.formatError(mixed.notType, params)
  },
}

export default Object.assign(Object.create(null), {
  mixed,
  string,
  number,
  date,
  object,
  array,
  boolean,
}) as LocaleObject
