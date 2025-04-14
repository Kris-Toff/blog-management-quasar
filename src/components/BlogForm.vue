<script setup>
import { ref, watch } from 'vue'
import { api } from 'src/boot/axios'
import { LocalStorage } from 'quasar'
import { useErrorHandler } from 'src/composables/errorHandler'

const props = defineProps({
  modelValue: Boolean,
})
const { showNotification } = useErrorHandler()
const myForm = ref(null)
const title = ref('')
const content = ref('')
const status = ref('Publish')
const options = ref(['Publish', 'Hide'])
const dialog = ref(props.modelValue)

const emit = defineEmits(['onOk', 'update:modelValue'])

function onSubmit() {
  myForm.value.validate().then((success) => {
    if (success) {
      api
        .post(
          '/blog-post',
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
        .then(function (response) {
          showNotification(response.data.message, 'success')
          dialog.value = false
          emit('onOk')
        })
        .catch(function (error) {
          showNotification(error.response.data.message, 'error')
        })
    } else {
      showNotification('Please fill out the form', 'error')
    }
  })
}

// to reset validations:
function reset() {
  myForm.value.resetValidation()
}

function resetInputFields() {
  title.value = ''
  content.value = ''
  status.value = 'Publish'
}

watch(
  () => props.modelValue,
  (v) => {
    dialog.value = v

    if (!v) {
      resetInputFields()
    }
  },
)

watch(dialog, (v) => {
  emit('update:modelValue', v)
})
</script>

<template>
  <q-dialog v-model="dialog">
    <q-card class="q-dialog-plugin" style="padding: 10px; min-width: 400px">
      <q-form @submit="onSubmit" @reset="reset" ref="myForm" class="q-gutter-md">
        <h4>Create Blog Post</h4>
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
