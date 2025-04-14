<script setup>
import { ref } from 'vue'
import { api } from 'src/boot/axios'
import { LocalStorage } from 'quasar'
import { useErrorHandler } from 'src/composables/errorHandler'

const myForm = ref(null)
const isPwd = ref(true)
const email = ref('')
const password = ref('')
const name = ref('')
const { showNotification } = useErrorHandler()

function onSubmit() {
  myForm.value.validate().then((success) => {
    if (success) {
      api
        .post('/register', {
          name: name.value,
          email: email.value,
          password: password.value,
        })
        .then(function (response) {
          LocalStorage.set('token', response.token)
        })
        .catch(function (error) {
          for (let key in error.response.data) {
            error.response.data[key].forEach((el) => {
              showNotification(el, 'error')
            })
          }
        })
    } else {
      showNotification('Please fill out the registration form', 'error')
    }
  })
}

// to reset validations:
function reset() {
  myForm.value.resetValidation()
}
</script>

<template>
  <q-page class="flex flex-center">
    <div class="row">
      <div class="col">
        <q-form
          @submit="onSubmit"
          @reset="reset"
          ref="myForm"
          class="q-gutter-md"
          style="min-width: 400px"
        >
          <h2 class="text-center">Register</h2>
          <q-input
            filled
            v-model="name"
            label="Name"
            hint="Name"
            lazy-rules
            :rules="[
              (val) => !!val || 'Please enter your name',
              (val) => !(val.length <= 3) || 'Please type more than 3 characters',
            ]"
          />

          <q-input
            filled
            v-model="email"
            label="Email"
            hint="Email"
            lazy-rules
            :rules="[
              (val) => !!val || 'Email required!',
              (val, rules) => rules.email(val) || 'Please enter a valid email address',
            ]"
          />

          <q-input
            v-model="password"
            filled
            :type="isPwd ? 'password' : 'text'"
            hint="Password"
            label="Password"
            :rules="[
              (val) => !!val || 'Please enter a password',
              (val) => !(val.length <= 8) || 'Please type more than 8 characters',
            ]"
          >
            <template v-slot:append>
              <q-icon
                :name="isPwd ? 'visibility_off' : 'visibility'"
                class="cursor-pointer"
                @click="isPwd = !isPwd"
              />
            </template>
          </q-input>

          <div>
            <q-btn label="Register" type="submit" color="primary" class="full-width" />
          </div>
        </q-form>
      </div>
    </div>
  </q-page>
</template>

<style scoped></style>
