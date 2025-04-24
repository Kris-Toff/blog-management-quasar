<script setup>
import { api } from 'src/boot/axios'
import { ref } from 'vue'
import { useErrorHandler } from 'src/composables/errorHandler'

const posts = ref([])
const { showNotification } = useErrorHandler

function fetchData() {
  api
    .get('/blog-posts/published')
    .then(function (response) {
      posts.value = response.data.blog_posts
    })
    .catch(function (error) {
      showNotification(error.response.data.message, 'error')
    })
}

fetchData()
</script>

<template>
  <q-page class="flex content-start justify-center">
    <div class="row q-pb-xl">
      <div class="col-12">
        <h4>Posts</h4>
      </div>
      <div class="col-12 q-gutter-md">
        <q-card
          class="my-card bg-primary text-white"
          style="min-width: 400px; max-width: 400px"
          v-for="post in posts"
          :key="post.id"
        >
          <q-card-section>
            <div class="text-h6">{{ post.title }}</div>
            <div class="text-subtitle2">by {{ post.created_by }}</div>
          </q-card-section>

          <q-separator dark />

          <q-card-section>
            {{ post.content }}
          </q-card-section>
        </q-card>
      </div>
    </div>
  </q-page>
</template>
