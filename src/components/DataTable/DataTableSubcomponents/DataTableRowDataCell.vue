<template>
    <component
        v-if="column.component"
        :is="column.component"
        v-model:row="rowModel"
        :column="{ ...column, index: columnIndex }"
    />
    <slot v-else-if="column.cellSlot" name="body">
        <slot
            :name="column.cellSlot"
            :row="rowModel"
            :column="{ ...column, index: columnIndex }"
        />
    </slot>
    <span
        v-else
        class="text-gray-800"
        v-html="
            column.formatter ? column.formatter(row, column) : row[column.key]
        "
    />
</template>
<script lang="ts" setup>
import type { TableColumn } from "./DataTable.types";

defineProps<{
    row: Record<string, any>;
    rowIndex: number;
    column: TableColumn;
    columnIndex: number;
}>();

const rowModel = defineModel<Record<string, any>>("row");
</script>
