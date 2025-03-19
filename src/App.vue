<template>
  <main class="p-5 font-sans">
    <div class="flex gap-5 py-5 overflow-x-auto">
      <Draggable v-model="filteredLists" group="lists" item-key="id" class="flex gap-4">
        <template #item="{ element: list, index }">
          <div
            class="bg-gray-100 p-3 rounded-lg min-w-[250px] max-w-[300px] flex flex-col relative"
          >
            <h2 class="font-medium mb-2">{{ list.title }}</h2>
            <button
              @click.self="toggleFilters(list, index)"
              class="card-control absolute right-2 top-2 cursor-pointer p-2 hover:bg-black/20 hover:text-white flex justify-center items-center rounded-full"
            >
              <Filter class="size-5 pointer-events-none relative" />
              <div
                class="card-filters absolute top-18 left-[50%] translate-[-50%] p-4 z-2 text-black bg-gray-200 shadow-xlr cursor-default rounded-lg before:w-0 before:h-0 before:border-l-10 before:border-r-10 before:border-b-10 before:border-b-gray-200 before:border-r-transparent before:border-l-transparent before:bottom-0 before:absolute before:-top-2.5 before:left-[50%] before:translate-x-[-50%]"
                v-if="list.filterOpened"
              >
                <input
                  type="text"
                  name="task-query"
                  id="task-query"
                  placeholder="Card Filter"
                  class="border-2 rounded-lg p-1"
                  v-model="cardFilters[index]"
                />
              </div>
            </button>
            <div class="flex flex-col justify-between h-full">
              <Draggable v-model="list.cards" group="cards" item-key="id">
                <template #item="{ element: card }">
                  <div
                    :class="[
                      'bg-white p-2 my-2 rounded shadow cursor-pointer',
                      { 'border-r-10': hasColor(card.color) }
                    ]"
                    :style="colorTab(card.color)"
                    @click="openModal(index, card)"
                  >
                    <div class="size-full">
                      <ul class="flex flex-wrap justify-start gap-1">
                        <li
                          class="card-tag size-full flex justify-center items-center rounded-full px-4 w-max border-1 border-black"
                          :style="{ background: tag.color, color: tagText(tag.color) }"
                          v-for="tag in card.tags"
                        >
                          {{ trimmedDescription(tag.description) }}
                        </li>
                      </ul>
                    </div>
                    <span class="text-sm font-medium">{{ card.title }}</span>
                    <p class="text-xs text-gray-400">{{ card.description }}</p>
                  </div>
                </template>
              </Draggable>

              <button
                class="w-full bg-transparent hover:bg-white text-gray-500 p-2 text-left mt-2 text-sm font-medium cursor-pointer"
                @click="openModal(index)"
              >
                + Add Card
              </button>
            </div>
            <span class="text-[10px] text-gray-500 font-black mt-2"
              >Cards in list: {{ list.cards.length }}</span
            >
          </div>
        </template>
      </Draggable>
    </div>
    <ModalDialog
      :isOpen="isModalOpen"
      @close="closeModal"
      @save="saveCard"
      :card="editingCard"
      :mode="modalMode"
    />
  </main>
</template>

<script setup lang="ts">
import Draggable from 'vuedraggable';
import { computed, ref, watch } from 'vue';
import ModalDialog from './components/ModalDialog.vue';
import type { Card, List, ColorTypes } from './types.ts';
import { Filter } from 'lucide-vue-next';

const isModalOpen = ref(false);
const editingCard = ref<Card | null>(null);
const editingListIndex = ref<number | null>(null);
const formIsValid = ref<boolean>(true);
const cardFilters = ref<string[]>(['', '', '']);

const changedIndexes = computed(() =>
  cardFilters.value.map((value, index) => ({
    index,
    value
  }))
);

const modalMode = computed(() => (editingCard.value === null ? 'add' : 'edit'));

const openModal = (listIndex: number, card?: Card) => {
  editingListIndex.value = listIndex;
  editingCard.value = card === undefined ? null : card;
  isModalOpen.value = true;
  console.log(card);
};

const colorTab = computed(() => {
  return (color: ColorTypes) => {
    return `border-color: ${color}`;
  };
});

const hasColor = computed(() => {
  return (color: ColorTypes) => color !== 'none';
});

const trimmedDescription = (description: string) => {
  let trimmedDescription = description;
  if (trimmedDescription.length > 22)
    trimmedDescription = trimmedDescription.substring(0, 22).trim() + '...';
  return computed(() => trimmedDescription);
};

const tagText = (color: ColorTypes) => {
  // console.log(color === 'yellow' ? 'black' : 'white');
  return color === 'yellow' || color === 'none' ? 'black' : 'white';
};

const saveCard = (card: Card) => {
  if (editingListIndex.value === null) return;
  formIsValid.value = true;

  if (formValidation(card)) {
    if (modalMode.value === 'add') {
      // Adding
      const newId = Math.max(...lists.value.flatMap((list) => list.cards.map((c) => c.id))) + 1;

      lists.value[editingListIndex.value].cards.push({
        ...card,
        id: newId
      });
    } else {
      // Modify
      const cardIndex = lists.value[editingListIndex.value].cards.findIndex(
        (listCard) => listCard.id === card.id
      );

      if (cardIndex !== -1) lists.value[editingListIndex.value].cards[cardIndex] = card;
    }
    closeModal();
  } else {
    formIsValid.value = false;
  }
};

const formValidation = (card: Card) => {
  if (card.title.length === 0) return false;
  if (card.description.length === 0) return false;

  return true;
};

const closeModal = () => {
  isModalOpen.value = false;
  editingListIndex.value = null;
  editingCard.value = null;
};

const lists = ref<List[]>([
  {
    id: 1,
    title: 'To Do',
    cards: [
      {
        id: 1,
        title: 'Task 1',
        description: 'Description for Task 1',
        color: 'red',
        deadline: null,
        tags: []
      },
      {
        id: 2,
        title: 'Task 2',
        description: 'Description for Task 2',
        color: 'purple',
        deadline: null,
        tags: []
      }
    ],
    filterOpened: false
  },
  {
    id: 2,
    title: 'In Progress',
    cards: [
      {
        id: 3,
        title: 'Task 3',
        description: 'Description for Task 3',
        color: 'green',
        deadline: null,
        tags: [
          {
            color: 'red',
            description: 'text with more thanth e allowed text to show that it clears things nicely'
          },
          { color: 'purple', description: 'text' },
          { color: 'yellow', description: 'text' },
          { color: 'green', description: 'text' },
          { color: 'orange', description: 'text' },
          { color: 'blue', description: 'text' }
        ]
      },
      {
        id: 4,
        title: 'Task 4',
        description: 'Description for Task 4',
        color: 'blue',
        deadline: null,
        tags: []
      }
    ],
    filterOpened: false
  },
  {
    id: 3,
    title: 'Done',
    cards: [
      {
        id: 5,
        title: 'Task 5',
        description: 'Description for Task 5',
        color: 'yellow',
        deadline: null,
        tags: []
      }
    ],
    filterOpened: false
  }
]);

const resetFilters = (index: number) => {
  cardFilters.value[index] = '';
};

const toggleFilters = (list: List, index: number) => {
  for (let i = 0; i < lists.value.length; i++) {
    if (lists.value[i].filterOpened && i !== index) {
      lists.value[i].filterOpened = false;
      resetFilters(i);
    }
  }
  list.filterOpened = !list.filterOpened;
};

const filteredLists = ref<List[]>([...lists.value]);

watch(
  changedIndexes,
  (newValues, oldValues) => {
    newValues.forEach(({ value }, index) => {
      if (value !== oldValues[index].value) {
        const listsCopy = [...lists.value];
        const filteredCards = listsCopy[index].cards.filter((card) =>
          card.title.toLowerCase().includes(value.toLowerCase())
        );

        const newCard = {
          ...listsCopy[index],
          cards: filteredCards
        };

        listsCopy[index] = newCard;

        filteredLists.value = listsCopy;
      }
    });
  },
  { deep: true }
);
</script>

<style></style>
