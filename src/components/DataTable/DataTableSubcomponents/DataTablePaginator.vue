<template>
    <div
        class="flex flex-col sm:flex-row items-center justify-between gap-3 p-4"
    >
        <div class="flex items-center gap-1">
            <select
                v-model="perPageModel"
                @change="updatePerPage"
                class="border rounded-sm px-2 py-1 text-sm text-gray-700 focus:ring focus:ring-blue-200 focus:border-blue-500 me-2"
            >
                <option v-for="size in pageOptions" :key="size" :value="size">
                    {{ size }}
                </option>
            </select>
            <button
                class="px-2 py-1 text-gray-500 hover:text-gray-800 disabled:opacity-40"
                :class="{
                    'cursor-not-allowed': pageModel === 1,
                    'cursor-pointer': pageModel !== 1,
                }"
                :disabled="pageModel === 1"
                @click="goToPage(1)"
            >
                «
            </button>
            <button
                class="px-2 py-1 text-gray-500 hover:text-gray-800 disabled:opacity-40"
                :class="{
                    'cursor-not-allowed': pageModel === 1,
                    'cursor-pointer': pageModel !== 1,
                }"
                :disabled="pageModel === 1"
                @click="goToPage(pageModel - 1)"
            >
                ‹
            </button>

            <button
                v-for="page in visiblePages"
                :key="page"
                class="px-3 py-1 rounded-md text-sm font-medium cursor-pointer"
                :class="
                    page === pageModel
                        ? 'bg-[#615fff] text-white'
                        : 'hover:bg-gray-100 text-gray-700'
                "
                @click="goToPage(page)"
            >
                {{ page }}
            </button>

            <button
                class="px-2 py-1 text-gray-500 hover:text-gray-800 disabled:opacity-40"
                :disabled="pageModel === total"
                :class="{
                    'cursor-not-allowed': pageModel === total,
                    'cursor-pointer': pageModel !== total,
                }"
                @click="goToPage(pageModel + 1)"
            >
                ›
            </button>
            <button
                class="px-2 py-1 text-gray-500 hover:text-gray-800 disabled:opacity-40"
                :disabled="pageModel === total"
                :class="{
                    'cursor-not-allowed': pageModel === total,
                    'cursor-pointer': pageModel !== total,
                }"
                @click="goToPage(total)"
            >
                »
            </button>
        </div>

        <div v-show="total" class="text-sm text-gray-500">
            {{ pageModel || 1 }} of {{ totalItems || 0 }}
        </div>
    </div>
</template>

<script lang="ts" setup>
import { computed } from "vue";

interface PaginatorProps {
    totalItems: number;
    modelValue: number;
    perPage?: number;
    pageOptions?: number[];
    maxVisiblePages?: number;
}

const props = withDefaults(defineProps<PaginatorProps>(), {
    totalItems: 0,
    modelValue: 1,
    perPage: 10,
    pageOptions: () => [5, 10, 20, 50],
    maxVisiblePages: 5,
});

const emit = defineEmits<{
    (e: "paginate", value: { page: number; perPage: number }): void;
}>();

const perPageModel = defineModel<number>("perPage", {
    default: 10,
});

const pageModel = defineModel<number>("modelValue", {
    default: 1,
});

const total = computed(() =>
    Math.max(1, Math.ceil(props.totalItems / perPageModel.value))
);

const visiblePages = computed(() => {
    const half = Math.floor(props.maxVisiblePages / 2);
    let start = Math.max(1, pageModel.value - half);
    let end = Math.min(total.value, start + props.maxVisiblePages - 1);

    if (end - start < props.maxVisiblePages - 1) {
        start = Math.max(1, end - props.maxVisiblePages + 1);
    }

    const pages: number[] = [];
    for (let i = start; i <= end; i++) pages.push(i);
    return pages;
});

const goToPage = (page: number): void => {
    if (page < 1 || page > total.value || page === pageModel.value) return;
    pageModel.value = page;
    emit("paginate", {
        page: +pageModel.value || 1,
        perPage: +perPageModel.value || 10,
    });
};

const updatePerPage = (): void => {
    pageModel.value = 1;
    emit("paginate", {
        page: +pageModel.value || 1,
        perPage: +perPageModel.value || 10,
    });
};
</script>
