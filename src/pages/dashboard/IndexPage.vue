<script setup>
import { computed, ref } from 'vue'
import { api } from 'src/boot/axios'
import { LocalStorage, useQuasar } from 'quasar'
import { useRouter } from 'vue-router'
import BlogForm from 'src/components/BlogForm.vue'
import BlogFormEdit from 'src/components/BlogFormEdit.vue'
import PostPreview from 'src/components/PostPreview.vue'

const $q = useQuasar()

const columns = [
  {
    name: 'title',
    field: 'title',
    required: true,
    label: 'Title',
  },
  {
    name: 'content',
    field: 'content',
    required: true,
    label: 'Content',
  },
  {
    name: 'status',
    field: 'status',
    required: true,
    label: 'Status',
  },
  {
    name: 'created_by',
    field: 'created_by',
    required: true,
    label: 'Created By',
  },
  {
    name: 'action',
    field: 'action',
    required: true,
    label: 'Action',
    align: 'center',
  },
]

const rows = ref([])
const addDialog = ref(false)
const editDialog = ref(false)
const previewDialog = ref(false)
const dialogData = ref({
  title: 'adasd',
  content: 'dfgdfg',
  status: 'Publish',
})

const router = useRouter()

function fetchData() {
  api
    .get('/blog-posts', {
      headers: {
        Accept: 'application/json',
        Authorization: 'Bearer ' + LocalStorage.getItem('token'),
      },
    })
    .then(function (response) {
      rows.value = response.data.blog_posts
    })
    .catch(function () {
      router.push({ name: 'login' })
    })
}

function archivePost(id) {
  api
    .post(
      '/blog-post/archive/' + id,
      {},
      {
        headers: {
          Accept: 'application/json',
          Authorization: 'Bearer ' + LocalStorage.getItem('token'),
        },
      },
    )
    .then(function () {
      fetchData()
    })
    .catch(function (error) {
      console.log(error)
    })
}

function toggleEditDialog(data) {
  dialogData.value = data
  editDialog.value = true
}

function togglePreviewDialog(data) {
  dialogData.value = data
  previewDialog.value = true
}

function confirmArchive(id) {
  $q.dialog({
    title: 'Confirm',
    message: 'Are you sure you want to archive this post?',
    ok: 'Yes',
    cancel: 'No',
  })
    .onOk(() => {
      archivePost(id)
    })
    .onCancel(() => {})
    .onDismiss(() => {})
}

function updateStatus(data) {
  api
    .put(
      '/blog-post/update-status/' + data.id,
      {
        status: data.status == 'Publish' ? 'Hide' : 'Publish',
      },
      {
        headers: {
          Accept: 'application/json',
          Authorization: 'Bearer ' + LocalStorage.getItem('token'),
        },
      },
    )
    .then(function () {
      fetchData()
    })
    .catch(function (error) {
      console.log(error)
    })
}

function logout() {
  LocalStorage.clear()
  window.location.href = 'http://127.0.0.1:8000/logout'
  router.push({ name: 'login' })
}

const statusLabel = (v) =>
  computed(() => {
    return v == 'Publish' ? 'Hide' : 'Publish'
  })

// fetch initial data
fetchData()
</script>

<template>
  <q-page class="flex content-start justify-center q-mt-md">
    <blog-form v-model="addDialog" @onOk="fetchData" />
    <blog-form-edit v-model="editDialog" :data="dialogData" @onEditOk="fetchData" />
    <post-preview v-model="previewDialog" :data="dialogData" />
    <div class="row">
      <div class="col-12 flex justify-between">
        <q-btn label="Create new post" color="primary" @click="addDialog = true" />
        <q-btn label="Logout" color="primary" @click="logout" />
      </div>
      <div class="col-12 q-mt-md">
        <q-table
          flat
          bordered
          title="Blog Posts"
          :rows="rows"
          :columns="columns"
          row-key="title"
          style="max-width: 800px"
        >
          <template v-slot:body="props">
            <q-tr :props="props">
              <q-td key="title" :props="props">
                {{ props.row.title }}
              </q-td>
              <q-td key="content" :props="props" class="ellipsis" style="max-width: 100px">
                {{ props.row.content }}
              </q-td>
              <q-td key="status" :props="props">
                {{ props.row.status }}
              </q-td>
              <q-td key="created_by" :props="props">
                {{ props.row.created_by }}
              </q-td>
              <q-td key="action" :props="props">
                <q-btn flat icon="more_vert">
                  <q-menu>
                    <q-list style="min-width: 100px">
                      <q-item clickable v-close-popup @click="toggleEditDialog(props.row)">
                        <q-item-section>Edit</q-item-section>
                      </q-item>
                      <q-item clickable v-close-popup @click="updateStatus(props.row)">
                        <q-item-section
                          >Change Status to {{ statusLabel(props.row.status) }}</q-item-section
                        >
                      </q-item>
                      <q-item clickable v-close-popup @click="togglePreviewDialog(props.row)">
                        <q-item-section>Preview</q-item-section>
                      </q-item>
                      <q-item clickable v-close-popup @click="confirmArchive(props.row.id)">
                        <q-item-section>Archive</q-item-section>
                      </q-item>
                    </q-list>
                  </q-menu>
                </q-btn>
              </q-td>
            </q-tr>
          </template>
        </q-table>
      </div>
    </div>
  </q-page>
</template>

<style scoped></style>
