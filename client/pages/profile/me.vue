<script lang="ts" setup>
import * as yup from 'yup'
import { Field, Form, FormActions } from 'vee-validate'
import { definePageMeta } from '#imports'
import { useAuthStore } from '~/stores'
import {
  PresignedPutObjectQuery,
  PresignedPutObjectQueryVariables,
  UploadAvatarMutation,
  UploadAvatarMutationVariables,
} from '~/types/graphql'
import presignedPutUrlQuery from '~/graphql/files/queries/presigned-put-url.graphql'
import uploadAvatarMutation from '~/graphql/auth/mutations/upload-avatar.graphql'

const { t } = useI18n()
const { resolveClient } = useApolloClient()

definePageMeta({ middleware: 'auth' })
useHead({ title: t('profile.me') })

const authStore = useAuthStore()
const avatarDialog = ref(false)
const generalFields = ['username', 'email', 'lastName', 'firstName', 'sirName']

const schema = yup.object({
  fileUpload: yup.string().required().label(t('profile.media')),
})

const { mutate, onDone, loading } = useMutation<UploadAvatarMutation, UploadAvatarMutationVariables>(
  uploadAvatarMutation
)

onDone(async ({ data }) => {
  if (!data) return
  const { avatar } = data.uploadAvatar
  authStore.user && (authStore.user.avatar = avatar)
  avatarDialog.value = false
})

const abortController = new AbortController()
onBeforeUnmount(() => {
  abortController.abort()
})
const handleUpdateAvatar = async (
  values: UploadAvatarMutationVariables,
  { setErrors }: FormActions<UploadAvatarMutationVariables>
) => {
  try {
    const client = resolveClient()
    const presignedPutUrl: PresignedPutObjectQuery['presignedPutUrl'] = await client
      .query<PresignedPutObjectQuery, PresignedPutObjectQueryVariables>({
        query: presignedPutUrlQuery,
        variables: { fileName: values.fileUpload.name },
      })
      .then(({ data }) => data.presignedPutUrl)
    const response = await fetch(presignedPutUrl.presignedUrl, {
      method: 'put',
      body: values.fileUpload as unknown as File,
      signal: abortController.signal,
    })
    if (response.ok) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { __typename, presignedUrl, ...fileUpload } = presignedPutUrl
      mutate({ fileUpload })
    }
  } catch (e) {
    console.error(e)
    setErrors({ fileUpload: 'Ошибка загрузки' })
  }
}
</script>
<template>
  <v-container>
    <v-card>
      <v-card-title>{{ $t('profile.me') }}</v-card-title>
      <v-card-text>
        <v-row>
          <v-col>{{ $t('profile.avatar') }}</v-col>
          <v-col class="flex flex-col items-center">
            <v-avatar
              :image="authStore.avatarUrl"
              :color="authStore.avatarUrl ? null : 'primary'"
              size="100"
              class="mb-10"
            >
              {{ authStore.initials }}
            </v-avatar>
            <v-dialog v-model="avatarDialog" width="600">
              <template #activator="{ props }">
                <v-btn v-bind="props" variant="text">{{ $t('profile.uploadAvatar') }}</v-btn>
              </template>
              <Form as="v-form" :validation-schema="schema" @submit="handleUpdateAvatar">
                <v-card>
                  <v-card-title>{{ $t('profile.choseAvatar') }}</v-card-title>
                  <v-card-text>
                    <Field v-slot="{ field, errors }" name="fileUpload" type="file">
                      <v-file-input
                        v-bind="field"
                        :label="$t('profile.media')"
                        :error-messages="errors"
                        accept="image/*"
                      />
                    </Field>
                  </v-card-text>
                  <v-card-actions>
                    <v-btn @click="avatarDialog = false">
                      {{ $t('close') }}
                    </v-btn>
                    <v-spacer />
                    <v-btn :loading="loading" color="primary" type="submit">
                      {{ $t('profile.put') }}
                    </v-btn>
                  </v-card-actions>
                </v-card>
              </Form>
            </v-dialog>
          </v-col>
        </v-row>
        <v-row>
          <v-col>{{ $t('profile.general') }}</v-col>
          <v-col>
            <v-list>
              <v-list-item
                v-for="generalField in generalFields"
                :key="generalField"
                :title="authStore.user[generalField]"
                :subtitle="$t(`auth.${generalField}`)"
              />
            </v-list>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
  </v-container>
</template>
