<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  modelValue: Boolean,
  data: Object,
})
const emit = defineEmits(['update:modelValue'])

const dialog = ref(props.modelValue)

watch(
  () => props.modelValue,
  (v) => {
    dialog.value = v
  },
)

watch(dialog, (v) => {
  emit('update:modelValue', v)
})
</script>

<template>
  <q-dialog v-model="dialog">
    <q-card class="my-card bg-primary text-white" style="min-width: 400px">
      <q-card-section>
        <div class="text-h6">{{ data.title }}</div>
        <div class="text-subtitle2">by {{ data.created_by }}</div>
      </q-card-section>

      <q-separator dark />

      <q-card-section>
        {{ data.content }}
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<style scoped></style>
