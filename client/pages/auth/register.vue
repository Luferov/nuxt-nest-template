<script lang="ts" setup>
import * as yup from 'yup'
import { Field, Form, FormActions } from 'vee-validate'
import { definePageMeta, useLocalePath } from '#imports'
import { useRouter } from '#app'
import { useAuthStore } from '~/stores'
import { RegisterMutation, RegisterMutationVariables, UserRegisterInput } from '~/types/graphql'
import registerMutation from '~/graphql/auth/mutations/register.graphql'

const { t } = useI18n()
const { onLogin } = useApollo()
const router = useRouter()
const localePath = useLocalePath()
const authStore = useAuthStore()

definePageMeta({
  middleware: 'guest',
})

useHead({ title: t('auth.register') })

const { mutate, onDone, loading } = useMutation<RegisterMutation, RegisterMutationVariables>(registerMutation)
onDone(async ({ data }) => {
  if (!data) return
  const { accessToken, user } = data.register
  await onLogin(accessToken)
  authStore.user = user
  await router.push(localePath({ name: 'index' }))
})

const generalFields = ['username', 'lastName', 'firstName', 'sirName']

const schema = yup.object({
  email: yup.string().required().email().label(t('auth.email')),
  ...generalFields.reduce(
    (a, c) => ({
      ...a,
      [c]: yup
        .string()
        .required()
        .min(2)
        .label(t(`auth.${c}`)),
    }),
    {}
  ),
  password: yup.string().required().min(6).label(t('auth.password')),
  passwordConfirmation: yup
    .string()
    .oneOf([yup.ref('password')], t('auth.pc'))
    .label(t('auth.passwordConfirmation')),
})

const handleRegister = async (
  values: UserRegisterInput & { passwordConfirmation: string },
  { setErrors }: FormActions<UserRegisterInput>
) => {
  try {
    const { passwordConfirmation, ...userRegisterInput } = values // eslint-disable-line @typescript-eslint/no-unused-vars
    await mutate({ userRegisterInput })
  } catch (e) {
    setErrors({ username: 'Ошибка регистрации' })
  }
}
</script>
<template>
  <v-container>
    <Form as="v-form" :validation-schema="schema" @submit="handleRegister">
      <v-card :loading="loading" class="mx-auto lg:w-1/2">
        <v-card-title>{{ $t('auth.register') }}</v-card-title>
        <v-card-text>
          <Field v-slot="{ field, errors }" name="email">
            <v-text-field v-bind="field" :label="$t('auth.email')" :error-messages="errors" type="email" />
          </Field>
          <Field
            v-for="generalField in generalFields"
            :key="generalField"
            v-slot="{ field, errors }"
            :name="generalField"
          >
            <v-text-field v-bind="field" :label="$t(`auth.${generalField}`)" :error-messages="errors" />
          </Field>
          <Field v-slot="{ field, errors }" name="password">
            <v-text-field v-bind="field" :label="$t('auth.password')" :error-messages="errors" type="password" />
          </Field>
          <Field v-slot="{ field, errors }" name="passwordConfirmation">
            <v-text-field
              v-bind="field"
              :label="$t('auth.passwordConfirmation')"
              :error-messages="errors"
              type="password"
            />
          </Field>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn color="primary" type="submit">
            {{ $t('auth.doRegister') }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </Form>
  </v-container>
</template>
