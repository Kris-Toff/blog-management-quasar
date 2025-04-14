<script setup>
import { ref } from 'vue'
import { api } from 'src/boot/axios'
import { LocalStorage } from 'quasar'

const props = defineProps(['data'])

const myFormEdit = ref(null)
const title = ref('')
const content = ref('')
const status = ref('')
const options = ref(['Publish', 'Hide'])
const { dialogRef, onDialogHide, onDialogOK } = useDialogPluginComponent()

import { useDialogPluginComponent } from 'quasar'

defineEmits([
  // REQUIRED; need to specify some events that your
  // component will emit through useDialogPluginComponent()
  ...useDialogPluginComponent.emits,
])

function onSubmit() {
  myFormEdit.value.validate().then((success) => {
    if (success) {
      api
        .put(
          '/blog-post/' + props.data.id,
          {
            title: title.value,
            content: content.value,
            status: status.value,
          },
          {
            headers: {
              Accept: 'application/json',
              Authorization: 'Bearer ' + LocalStorage.getItem('token'),
            },
          },
        )
        .then(function () {
          onDialogOK()
        })
        .catch(function (error) {
          console.log(error)
        })
    } else {
      console.log('error')
      // oh no, user has filled in
      // at least one invalid value
    }
  })
}

// to reset validations:
function reset() {
  myFormEdit.value.resetValidation()
}

if (props.data) {
  title.value = props.data.title
  content.value = props.data.content
  status.value = props.data.status
}
</script>

<template>
  <q-dialog ref="dialogRef" @hide="onDialogHide">
    <q-card class="q-dialog-plugin" style="padding: 10px; min-width: 400px">
      <q-form @submit="onSubmit" @reset="reset" ref="myFormEdit" class="q-gutter-md">
        <q-input
          filled
          v-model="title"
          label="Title"
          hint="Title"
          lazy-rules
          :rules="[(val) => !!val || 'Title required!']"
        />

        <q-input
          filled
          v-model="content"
          label="Content"
          hint="Content"
          type="textarea"
          lazy-rules
          :rules="[(val) => !!val || 'Content required!']"
        />

        <q-select
          filled
          v-model="status"
          :options="options"
          label="Status"
          lazy-rules
          :rules="[(val) => !!val || 'Status required!']"
        />

        <div>
          <q-btn label="Save" type="submit" color="primary" class="full-width" />
        </div>
      </q-form>
    </q-card>
  </q-dialog>
</template>

<style scoped></style>
