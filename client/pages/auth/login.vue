<script setup lang="ts">
import { object, string } from 'yup'
import { Field, Form, FormActions } from 'vee-validate'
import { LoginMutation, LoginMutationVariables, UserLoginInput } from '~/types/graphql'
import loginMutation from '~/graphql/auth/mutations/login.graphql'
import { useAuthStore } from '~/stores'
import { definePageMeta, useLocalePath } from '#imports'
import { useRouter } from '#app'

const { t } = useI18n()
const { onLogin } = useApollo()
const router = useRouter()
const localePath = useLocalePath()
const authStore = useAuthStore()

definePageMeta({
  middleware: 'guest',
})

useHead({ title: t('auth.title') })

const { mutate, onDone, loading } = useMutation<LoginMutation, LoginMutationVariables>(loginMutation)
onDone(async ({ data }) => {
  if (!data) return
  const { accessToken, user } = data.login
  await onLogin(accessToken)
  authStore.user = user
  await router.push(localePath({ name: 'index' }))
})

const schema = object({
  username: string().required().min(2).label(t('auth.username')),
  password: string().required().min(4).label(t('auth.password')),
})

const handleSubmit = async (
  values: UserLoginInput,
  { setErrors }: FormActions<{ username: string; password: string }>
) => {
  try {
    await mutate({ userLoginInput: values })
  } catch (e) {
    setErrors({ username: t('auth.error'), password: t('auth.error') })
  }
}
</script>
<template>
  <v-container>
    <Form as="v-form" :validation-schema="schema" @submit="handleSubmit">
      <v-card :loading="loading" class="mx-auto w-50">
        <v-card-title>{{ $t('auth.title') }}</v-card-title>
        <v-card-text>
          <Field v-slot="{ field, errors }" name="username">
            <v-text-field v-bind="field" :label="$t('auth.username')" :error-messages="errors" />
          </Field>
          <Field v-slot="{ field, errors }" name="password">
            <v-text-field v-bind="field" :label="$t('auth.password')" :error-messages="errors" type="password" />
          </Field>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn color="primary" type="submit">
            {{ $t('auth.singing') }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </Form>
  </v-container>
</template>
