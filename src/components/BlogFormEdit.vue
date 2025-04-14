<script setup>
import { ref, watch } from 'vue'
import { api } from 'src/boot/axios'
import { LocalStorage } from 'quasar'

const props = defineProps({ data: {}, modelValue: Boolean })

const myFormEdit = ref(null)
const title = ref('')
const content = ref('')
const status = ref('Publish')
const options = ref(['Publish', 'Hide'])
const dialog = ref(props.modelValue)

const emit = defineEmits(['onEditOk', 'update:modelValue'])

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
          dialog.value = false
          emit('onEditOk')
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

watch(
  () => props.data,
  (v) => {
    title.value = v.title
    content.value = v.content
    status.value = v.status
  },
)

watch(dialog, (v) => {
  emit('update:modelValue', v)
})
</script>

<template>
  <q-dialog v-model="dialog">
    <q-card class="q-dialog-plugin" style="padding: 10px; min-width: 400px">
      <q-form @submit="onSubmit" @reset="reset" ref="myFormEdit" class="q-gutter-md">
        <h4>Edit Blog Post</h4>
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
