<script setup>
import { ref } from 'vue'
import { api } from 'src/boot/axios'
import { LocalStorage } from 'quasar'
import { useRouter } from 'vue-router'
import BlogForm from 'src/components/BlogForm.vue'
import BlogFormEdit from 'src/components/BlogFormEdit.vue'

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
  },
]

const rows = ref([])
const addDialog = ref(false)
const editDialog = ref(false)
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

function toggleEditDialog(data) {
  dialogData.value = data
  editDialog.value = true
}

// fetch initial data
fetchData()
</script>

<template>
  <q-page class="flex flex-center">
    <blog-form v-model="addDialog" @onOk="fetchData" />
    <blog-form-edit v-model="editDialog" :data="dialogData" @onEditOk="fetchData" />
    <div class="row">
      <div class="col-12">
        <q-btn label="Create new post" color="primary" @click="addDialog = true" />
      </div>
      <div class="col-12">
        <q-table flat bordered title="Blog Posts" :rows="rows" :columns="columns" row-key="title">
          <template v-slot:body="props">
            <q-tr :props="props">
              <q-td key="title" :props="props">
                <div>
                  {{ props.row.title }}
                </div>
              </q-td>
              <q-td key="content" :props="props">
                {{ props.row.content }}
              </q-td>
              <q-td key="status">
                {{ props.row.status }}
              </q-td>
              <q-td key="created_by">
                {{ props.row.created_by }}
              </q-td>
              <q-td key="action" :props="props">
                <q-btn flat icon="more_vert">
                  <q-menu>
                    <q-list style="min-width: 100px">
                      <q-item clickable v-close-popup @click="toggleEditDialog(props.row)">
                        <q-item-section>Edit</q-item-section>
                      </q-item>
                      <q-item clickable v-close-popup>
                        <q-item-section>Change Status</q-item-section>
                      </q-item>
                      <q-item clickable v-close-popup>
                        <q-item-section>Preview</q-item-section>
                      </q-item>
                      <q-item clickable v-close-popup>
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
