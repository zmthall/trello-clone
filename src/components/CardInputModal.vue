<template>
  <!-- <div
    class="fixed inset-0 bg-black/25 backdrop-blur-sm flex items-center justify-center"
    role="dialog"
    aria-modal="true"
    v-if="isOpen"
    @keydown.esc="closeCard"
    ref="modalElement"
    @click.self="closeCard"
  >
    <div class="bg-white p-5 rounded max-w-[400px] max-h-[80%] overflow-y-auto overflow-x-hidden"> -->
  <BaseModal :isOpen="isOpen" @close="closeCard" ref="modalRef">
    <div class="space-y-4">
      <h2 class="text-xl font-bold">
        {{ cardTitle }}
      </h2>
      <h3 class="text-sm font-bold mb-1">Card Details:</h3>
      <input
        type="text"
        name="title"
        id="title"
        placeholder="Card Title"
        aria-label="Card Title"
        class="w-full p-1 text-sm border-1 border-gray-200 focus:border-black rounded hover:bg-gray-50"
        ref="inputElement"
        requied
        v-model.trim="localCard.title"
      />
      <textarea
        name="description"
        id="description"
        placeholder="Description"
        class="w-full p-1 border-1 text-sm border-gray-200 focus:border-black rounded resize-none hover:bg-gray-50"
        rows="4"
        required
        v-model.trim="localCard.description"
      ></textarea>
      <ColorInput id="card" name="card" v-model="localCard" />
      <div
        :class="[
          'flex',
          { 'flex-col': deadlineSet || tagsSet },
          { 'gap-2': !deadlineSet && !tagsSet }
        ]"
      >
        <div>
          <div v-if="!deadlineSet" class="flex gap-2">
            <input type="checkbox" name="has-deadline" id="has-deadline" v-model="hasDeadline" />
            <label for="has-deadline">Set deadline</label>
          </div>
          <template v-else>
            <h3 class="text-sm font-bold mb-1" v-if="deadlineSet">Deadline:</h3>
            <input
              type="datetime-local"
              name="title"
              id="title"
              placeholder="Card Title"
              aria-label="Card Deadline"
              class="w-full p-2 border-1 border-gray-200 rounded"
              v-model="localCard.deadline"
            />
          </template>
        </div>
        <div :class="['overflow-hidden space-y-4', { 'mt-2': tagsSet }]">
          <div v-if="!tagsSet" class="flex gap-2">
            <input type="checkbox" name="has-tags" id="has-tags" v-model="hasTags" />
            <label for="has-tags">Set Tags</label>
          </div>
          <template v-if="tagsSet">
            <h3 class="text-sm font-bold mb-1">Tag Details:</h3>
            <div class="flex items-center justify-between">
              <input
                type="text"
                name="tag-input"
                id="tag-input"
                placeholder="Tag Description"
                class="w-3/4 p-1 text-sm border-1 border-gray-200 focus:border-black rounded hover:bg-gray-50"
                v-model.trim="tagInput.description"
              />
              <button
                type="button"
                class="text-xs rounded-full h-max px-2 py-1 bg-blue-500 text-white"
                @click="addTag"
              >
                Add Tag
              </button>
            </div>
            <ColorInput id="tag" name="tag" v-model="tagInput" />
            <ul
              class="w-full mx-auto flex gap-2 overflow-x-auto overflow-y-hidden py-1"
              v-if="tagged"
            >
              <li
                class="px-4 py-1 bg-gray-100 rounded-lg whitespace-nowrap flex relative mb-1 cursor-default"
                v-for="(tag, idx) in tags"
                @click.self="editTag(tag, idx)"
              >
                <span class="block pointer-events-none">{{ tag.description }}</span>
                <button @click.self="deleteTag(idx)" class="text-[12px] absolute top-0 right-1.5">
                  x
                </button>
              </li>
            </ul>
          </template>
        </div>
      </div>
    </div>

    <div class="flex justify-between items-center gap-2 mt-4">
      <div>
        <p v-if="lastEditedTime" class="text-[11px]">
          <span class="font-bold">Last Edited:</span> {{ lastEditedTime }}
        </p>
      </div>
      <div class="flex gap-2">
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
  </BaseModal>
  <!-- </div>
  </div> -->
</template>

<script setup lang="ts">
import { computed, nextTick, ref, watch } from 'vue';
import { useFocusTrap } from '@vueuse/integrations/useFocusTrap';
import type { Card } from '../types.ts';
import ColorInput from './ColorInput.vue';
import BaseModal from './BaseModal.vue';

const props = defineProps<{
  isOpen: boolean;
  card: Card | null;
  mode: 'add' | 'edit';
}>();
const modalRef = ref<InstanceType<typeof BaseModal> | null>(null);
const inputElement = ref<HTMLInputElement | null>(null);
const localCard = ref<Card>({
  id: 0,
  title: '',
  description: '',
  color: '',
  deadline: null,
  tags: [],
  lastEdited: null
});
const hasDeadline = ref<boolean>(false);
const hasTags = ref<boolean>(false);
const tagInput = ref<string>({ color: 'green', description: '' });
const editIndex = ref<number | null>(null);

watch(
  () => props.card,
  (newCard) => {
    if (newCard) {
      localCard.value = { ...newCard };
      tags.value = [...localCard.value.tags];
    } else {
      localCard.value = {
        id: 0,
        title: '',
        description: '',
        color: '',
        deadline: null,
        tags: [],
        lastEdited: null
      };
    }
  },
  { immediate: true }
);

const tags = ref<Object[]>([]);

const addTag = () => {
  let description = tagInput.value.description;
  if (description.length !== 0 && editIndex.value === null) {
    tags.value.push({
      description,
      color: tagInput.value.color
    });

    tagInput.value = { description: '', color: 'green' };
  } else if (editIndex.value !== null) {
    tags.value.splice(editIndex.value, 0, {
      description,
      color: tagInput.value.color
    });
    tagInput.value = { description: '', color: 'green' };
    editIndex.value = null;
  }
};

const saveCard = () => {
  hasDeadline.value = false;
  hasTags.value = false;
  localCard.value.tags = tags.value;
  tags.value = [];
  tagInput.value = { description: '', color: 'green' };
  editIndex.value = null;
  emit('save', localCard.value);
};

const closeCard = () => {
  hasDeadline.value = false;
  hasTags.value = false;
  tags.value = [];
  tagInput.value = { description: '', color: 'green' };
  editIndex.value = null;
  emit('close');
};

const editTag = (tag, idx) => {
  tagInput.value = {
    description: tag.description,
    color: tag.color
  };

  tags.value.splice(idx, 1);
  editIndex.value = idx;
};

const deleteTag = (idx) => {
  tags.value.splice(idx, 1);
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
      if (modalRef.value?.modalElement) {
        activate(); // Only activate if modalElement exists
      }
      inputElement.value?.focus();
    } else {
      deactivate();
    }
  }
);

// Extract the modal’s internal `modalElement` and pass it to `useFocusTrap`
const { activate, deactivate } = useFocusTrap(() => modalRef.value?.modalElement);

const lastEditedTime = computed(() => {
  if (localCard.value.lastEdited) {
    const options = { month: 'long', day: 'numeric', year: 'numeric' };
    const dateFormat = new Intl.DateTimeFormat('en-US', options);
    return dateFormat.format(localCard.value.lastEdited);
  } else return false;
});

const deadlineSet = computed(() => {
  return localCard.value.deadline !== null || hasDeadline.value;
});

const tagsSet = computed(() => {
  return tags.value.length !== 0 || hasTags.value;
});

const tagged = computed(() => {
  return tags.value.length !== 0;
});

const cardTitle = computed(() => {
  return props.mode === 'add' ? 'Add New Card' : 'Edit Card';
});

const buttonText = computed(() => {
  return props.mode === 'add' ? 'Add' : 'Save';
});
</script>

<style></style>
