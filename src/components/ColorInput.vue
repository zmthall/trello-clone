<template>
  <div class="flex justify-between">
    <div class="w-10 h-10">
      <input
        type="radio"
        :name="inputName('color')"
        :id="inputId('green')"
        value="green"
        checked
        v-model="colorInput.color"
        class="appearance-none peer/radio-check absolute"
      />
      <label
        :for="inputId('green')"
        class="size-full block bg-[#008000] peer-checked/radio-check:border-4 peer-checked/radio-check:border-blue-200 hover:bg-green-300 cursor-pointer"
      ></label>
    </div>
    <div class="w-10 h-10">
      <input
        type="radio"
        :name="inputName('color')"
        :id="inputId('blue')"
        value="blue"
        v-model="colorInput.color"
        class="appearance-none peer/radio-check absolute"
      />
      <label
        :for="inputId('blue')"
        class="size-full block bg-[#0000ff] peer-checked/radio-check:border-4 peer-checked/radio-check:border-blue-200 hover:bg-blue-300 cursor-pointer"
      ></label>
    </div>
    <div class="w-10 h-10">
      <input
        type="radio"
        :name="inputName('color')"
        :id="inputId('yellow')"
        value="yellow"
        v-model="colorInput.color"
        class="appearance-none peer/radio-check absolute"
      />
      <label
        :for="inputId('yellow')"
        class="size-full block bg-[#ffff00] peer-checked/radio-check:border-4 peer-checked/radio-check:border-blue-200 hover:bg-yellow-200 cursor-pointer"
      ></label>
    </div>
    <div class="w-10 h-10">
      <input
        type="radio"
        :name="inputName('color')"
        :id="inputId('purple')"
        value="purple"
        v-model="colorInput.color"
        class="appearance-none peer/radio-check absolute"
      />
      <label
        :for="inputId('purple')"
        class="size-full block bg-[#800080] peer-checked/radio-check:border-4 peer-checked/radio-check:border-blue-200 hover:bg-purple-300 cursor-pointer"
      ></label>
    </div>
    <div class="w-10 h-10">
      <input
        type="radio"
        :name="inputName('color')"
        :id="inputId('orange')"
        value="orange"
        v-model="colorInput.color"
        class="appearance-none peer/radio-check absolute"
      />
      <label
        :for="inputId('orange')"
        class="size-full block bg-[#ffa500] peer-checked/radio-check:border-4 peer-checked/radio-check:border-blue-200 hover:bg-orange-300 cursor-pointer"
      ></label>
    </div>
    <div class="w-10 h-10">
      <input
        type="radio"
        :name="inputName('color')"
        :id="inputId('red')"
        value="red"
        v-model="colorInput.color"
        class="appearance-none peer/radio-check absolute"
      />
      <label
        :for="inputId('red')"
        class="size-full block bg-[#ff0000] peer-checked/radio-check:border-4 peer-checked/radio-check:border-blue-200 hover:bg-red-300 cursor-pointer"
      ></label>
    </div>
    <div class="w-10 h-10">
      <input
        type="radio"
        :name="inputName('color')"
        :id="inputId('none')"
        value="none"
        v-model="colorInput.color"
        class="appearance-none peer/radio-check absolute"
      />
      <label
        :for="inputId('none')"
        class="flex justify-center items-center size-full text-xs border-2 bg-white peer-checked/radio-check:border-4 peer-checked/radio-check:border-blue-200 hover:bg-gray-400 cursor-pointer hover:text-white"
        >None</label
      >
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
const colorInput = defineModel();

const props = defineProps<{
  id: string;
  name: string;
}>();

const inputId = (value: string) => {
  return computed(() => `${props.id}-${value}`).value;
};

const inputName = (value: string) => {
  return computed(() => `${props.name}-${value}`).value;
};
</script>

<style></style>
