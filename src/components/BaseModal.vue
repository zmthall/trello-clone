<template>
  <div
    class="fixed inset-0 bg-black/25 backdrop-blur-sm flex items-center justify-center"
    role="dialog"
    aria-modal="true"
    v-if="isOpen"
    @keydown.esc="closeCard"
    ref="modalElement"
    @click.self="closeCard"
  >
    <div class="bg-white p-5 rounded max-w-[400px] max-h-[80%] overflow-y-auto overflow-x-hidden">
      <slot></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
const emit = defineEmits<{
  (e: 'close'): void;
}>();

defineProps<{
  isOpen: boolean;
}>();

const modalElement = ref<HTMLDivElement | null>(null);

defineExpose({
  modalElement // Now the parent can access this
});

const closeCard = () => {
  emit('close');
};
</script>

<style></style>
