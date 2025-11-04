<script setup lang="ts">
import { getWeekDayOfMonth, countDaysInMonth  } from '../utils/date';
import type { Language, LocalesData } from './types';
import { computed, onMounted, ref } from 'vue';

const {language = "ru" as Language, size = 'small', selectedСurrentDate = new Date() } = defineProps<{
   language?: Language,
   size?: 'small' | 'medium' | 'large',
   selectedСurrentDate?: Date,
}>();

const data = ref<LocalesData | null>(null);
const currentDate = ref<Date>(selectedСurrentDate);

const firstWeekDay = computed(() => getWeekDayOfMonth(currentDate.value));
const dayCount = computed(() => countDaysInMonth(currentDate.value));
const firstZero = computed(() => firstWeekDay.value - 1);
const totalCells = computed(() => firstZero.value + dayCount.value);
const endZero = computed(() => (7 - (totalCells.value % 7)) % 7);

const cells = computed<(number | null)[]>(() => [
  ...Array(firstZero.value).fill(null),
  ...Array.from({ length: dayCount.value }, (_, i) => i + 1),
  ...Array(endZero.value).fill(null),
]);

const weeks = computed<(number | null)[][]>(() => {
  const result: (number | null)[][] = [];
  for (let i = 0; i < cells.value.length; i += 7) {
    result.push(cells.value.slice(i, i + 7));
  }
  return result;
});

const sizeClass = computed(() => {
  switch (size) {
    case 'small':
        return 'max-w-[280px]';
    case 'medium':
        return 'max-w-[336px]';
    case 'large':
        return 'max-w-[392px]';
    default:
        return 'max-w-[336px]';
  }
});

function selectDate(day: number | null) {
  if (!day) return;
  const newDate = new Date(currentDate.value);
  newDate.setDate(day);
  currentDate.value = newDate;
}

function changeMonth(offset: number) {
  const cur = currentDate.value;
  const y = cur.getFullYear();
  const m = cur.getMonth() + offset;
  currentDate.value = new Date(y, m, 1);
}

function previousMonth() { changeMonth(-1); }
function nextMonth() { changeMonth(1); }

onMounted(async () => {
    try {
        const mod = await import(`./locales/${language}.json`);
        data.value = mod.default as LocalesData;
        
    } catch (error) {
        console.error(error);
    }
});
</script>

<template>
    <div class="calendar border border-gray-300 p-2 rounded"
    :class="[sizeClass, 'w-full']">
    <div class="calendar-header flex flex-row justify-between">
        <div>
            <button class="text-blue-400 cursor-pointer hover:text-blue-600 active:text-blue-800"
            @click="previousMonth">Previous</button>
        </div>
        <div class="relative">
            <div class="text-blue-400 cursor-pointer">{{ currentDate.toLocaleDateString() }}</div>
            <input 
            type="date" 
            class="active:bg-blue-500"
            placeholder="Select a date"
            tabindex="-1"
            @change="(event: Event) => currentDate = (new Date((event.target as HTMLInputElement).value.split('-').map(Number).join('-')))"
            />
        </div>
        <div>
            <button class="text-blue-400 cursor-pointer hover:text-blue-600 active:text-blue-800"
            @click="nextMonth">Next</button>
        </div>
    </div>
      <ul class="flex flex-row">
        <li
          v-for="shortName in data?.shortDays"
          :key="shortName"
          class="flex-1 text-center text-sm font-medium text-gray-500 py-1"
        >
          {{ shortName }}
        </li>
      </ul>
  
      <div class="flex flex-col gap-1 mt-2">
        <div
          v-for="(week, i) in weeks"
          :key="i"
          class="flex flex-row"
        >
          <div
            v-for="(day, j) in week"
            :key="j"
            @click="selectDate(day)"
            class="flex-1 text-center py-1 h-8 flex items-center justify-center rounded transition cursor-pointer select-none"
            :class="{
              'text-gray-800 hover:bg-gray-100 active:bg-gray-200': day,
              'border border-blue-500 font-semibold text-blue-600': day && day === new Date(currentDate).getDate(),
              'text-transparent cursor-default': !day
            }"
          >
            {{ day }}
          </div>
        </div>
      </div>
    </div>
  </template>