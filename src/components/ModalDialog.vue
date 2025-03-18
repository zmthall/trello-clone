<template>
  <div
    class="fixed inset-0 bg-black/25 backdrop-blur-sm flex items-center justify-center"
    role="dialog"
    aria-modal="true"
    v-if="isOpen"
    @keydown.esc="emit('close')"
    ref="modalElement"
    @click.self="emit('close')"
  >
    <div class="bg-white p-5 rounded max-w-md w-full space-y-4">
      <h2 class="text-xl font-bold">
        {{ cardTitle }}
      </h2>
      <input
        type="text"
        name="title"
        id="title"
        placeholder="Card Title"
        aria-label="Card Title"
        class="w-full p-2 border rounded"
        ref="inputElement"
        requied
        v-model="localCard.title"
      />
      <textarea
        name="description"
        id="description"
        placeholder="Description"
        class="w-full p-2 border rounded"
        required
        v-model="localCard.description"
      ></textarea>
      <div class="flex justify-between">
        <div class="w-10 h-10">
          <input
            type="radio"
            name="color"
            id="green"
            value="green"
            checked
            v-model="localCard.color"
            class="appearance-none peer/radio-check absolute"
          />
          <label
            for="green"
            class="size-full block bg-[#008000] peer-checked/radio-check:border-4 peer-checked/radio-check:border-blue-200 hover:bg-green-300 cursor-pointer"
          ></label>
        </div>
        <div class="w-10 h-10">
          <input
            type="radio"
            name="color"
            id="blue"
            value="blue"
            v-model="localCard.color"
            class="appearance-none peer/radio-check absolute"
          />
          <label
            for="blue"
            class="size-full block bg-[#0000ff] peer-checked/radio-check:border-4 peer-checked/radio-check:border-blue-200 hover:bg-blue-300 cursor-pointer"
          ></label>
        </div>
        <div class="w-10 h-10">
          <input
            type="radio"
            name="color"
            id="yellow"
            value="yellow"
            v-model="localCard.color"
            class="appearance-none peer/radio-check absolute"
          />
          <label
            for="yellow"
            class="size-full block bg-[#ffff00] peer-checked/radio-check:border-4 peer-checked/radio-check:border-blue-200 hover:bg-yellow-200 cursor-pointer"
          ></label>
        </div>
        <div class="w-10 h-10">
          <input
            type="radio"
            name="color"
            id="purple"
            value="purple"
            v-model="localCard.color"
            class="appearance-none peer/radio-check absolute"
          />
          <label
            for="purple"
            class="size-full block bg-[#800080] peer-checked/radio-check:border-4 peer-checked/radio-check:border-blue-200 hover:bg-purple-300 cursor-pointer"
          ></label>
        </div>
        <div class="w-10 h-10">
          <input
            type="radio"
            name="color"
            id="orange"
            value="orange"
            v-model="localCard.color"
            class="appearance-none peer/radio-check absolute"
          />
          <label
            for="orange"
            class="size-full block bg-[#ffa500] peer-checked/radio-check:border-4 peer-checked/radio-check:border-blue-200 hover:bg-orange-300 cursor-pointer"
          ></label>
        </div>
        <div class="w-10 h-10">
          <input
            type="radio"
            name="color"
            id="red"
            value="red"
            v-model="localCard.color"
            class="appearance-none peer/radio-check absolute"
          />
          <label
            for="red"
            class="size-full block bg-[#ff0000] peer-checked/radio-check:border-4 peer-checked/radio-check:border-blue-200 hover:bg-red-300 cursor-pointer"
          ></label>
        </div>
        <div class="w-10 h-10">
          <input
            type="radio"
            name="color"
            id="none"
            value="none"
            v-model="localCard.color"
            class="appearance-none peer/radio-check absolute"
          />
          <label
            for="none"
            class="flex justify-center items-center size-full text-xs border-2 bg-white peer-checked/radio-check:border-4 peer-checked/radio-check:border-blue-200 hover:bg-gray-400 cursor-pointer hover:text-white"
            >None</label
          >
        </div>
      </div>
      <div v-if="!deadlineSet" class="flex gap-2">
        <input type="checkbox" name="has-deadline" id="has-deadline" v-model="hasDeadline" />
        <label for="has-deadline">Set deadline</label>
      </div>
      <input
        type="datetime-local"
        name="title"
        id="title"
        placeholder="Card Title"
        aria-label="Card Deadline"
        class="w-full p-2 border rounded"
        v-else
        v-model="localCard.deadline"
      />

      <div class="flex justify-end gap-2">
        <button
          class="bg-gray-300 hover:bg-gray-200 text-black px-4 py-2 rounded cursor-pointer"
          @click="closeCard"
        >
          Cancel
        </button>
        <button
          class="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded cursor-pointer"
          @click="saveCard"
        >
          {{ buttonText }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, nextTick, ref, watch } from 'vue';
import { useFocusTrap } from '@vueuse/integrations/useFocusTrap';
import type { Card } from '../types.ts';

const props = defineProps<{
  isOpen: boolean;
  card: Card | null;
  mode: 'add' | 'edit';
}>();

const modalElement = ref<HTMLDivElement | null>(null);
const { activate, deactivate } = useFocusTrap(modalElement);
const inputElement = ref<HTMLInputElement | null>(null);
const localCard = ref<Card>({ id: 0, title: '', description: '', color: '', deadline: null });
const hasDeadline = ref<boolean>(false);

watch(
  () => props.card,
  (newCard) => {
    if (newCard) {
      localCard.value = { ...newCard };
    } else {
      localCard.value = { id: 0, title: '', description: '', color: '', deadline: null };
    }
  },
  { immediate: true }
);

const saveCard = () => {
  hasDeadline.value = false;
  emit('save', localCard.value);
};

const closeCard = () => {
  hasDeadline.value = false;
  emit('close');
};

const emit = defineEmits<{
  (e: 'close'): void;
  (e: 'save', card: Card): void;
}>();

watch(
  () => props.isOpen,
  async (newVal) => {
    if (newVal) {
      await nextTick();
      activate();
      inputElement.value?.focus();
    } else {
      deactivate();
    }
  }
);

const deadlineSet = computed(() => {
  return localCard.value.deadline !== null || hasDeadline.value;
});

const cardTitle = computed(() => {
  return props.mode === 'add' ? 'Add New Card' : 'Edit Card';
});

const buttonText = computed(() => {
  return props.mode === 'add' ? 'Add' : 'Save';
});
</script>

<style></style>
