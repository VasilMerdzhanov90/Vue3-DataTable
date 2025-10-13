<template>
    <div
        @click="sort"
        class="flex gap-2 items-center"
        :class="{ 'cursor-pointer': columnModel.sortable }"
    >
        <component
            v-if="columnModel.headerComponent"
            :is="columnModel.headerComponent"
            :column="{ ...columnModel, index: index }"
        />
        <slot
            v-if="columnModel.headerSlot"
            :name="columnModel.headerSlot"
            :column="{ ...columnModel, index: index }"
        />
        <span
            v-else
            class="font-medium text-gray-900"
            v-html="columnModel.title || ''"
        >
        </span>
        <span
            class="font-medium text-gray-700 text-xs"
            :class="resolveSortableIcon"
        >
        </span>
    </div>
</template>

<script lang="ts" setup>
import { computed } from "vue";
import type { TableColumn } from "./../DataTable.types";

withDefaults(defineProps<{ column: TableColumn; index: number }>(), {
    column: () => ({} as TableColumn),
    index: 0,
});

const emit = defineEmits<{
    (
        e: "sort",
        column: TableColumn,
        context: { key: string; direction: "asc" | "desc" | null }
    ): void;
}>();

const columnModel = defineModel<TableColumn>("column", {
    default: () => ({} as TableColumn),
});

const resolveSortableIcon = computed(() => {
    if (!columnModel.value || !columnModel.value.sortable) return "";
    if (!columnModel.value.direction) {
        return "pi pi-sort-alt";
    } else if (columnModel.value.direction === "asc") {
        return "pi pi-sort-amount-up-alt";
    } else if (columnModel.value.direction === "desc") {
        return "pi pi-sort-amount-down-alt";
    }
});
const sort = () => {
    if (!columnModel.value || !columnModel.value.sortable) return;

    if (columnModel.value.direction === "asc") {
        columnModel.value.direction = "desc";
    } else if (columnModel.value.direction === "desc") {
        columnModel.value.direction = null;
    } else {
        columnModel.value.direction = "asc";
    }

    emit("sort", columnModel.value, {
        key: columnModel.value.key,
        direction: columnModel.value.direction as "asc" | "desc" | null,
    });
};
</script>
