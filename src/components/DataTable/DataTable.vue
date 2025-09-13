<template>
    <div class="border-1 border-gray-200 shadow-lg rounded-md">
        <div v-if="records" class="flex px-3 py-2 border-b border-gray-200">
            <Button size="md">actions</Button>
        </div>
        <div class="overflow-x-auto">
            <table class="w-full rounded-lg">
                <thead>
                    <tr class="bg-gray-50">
                        <th
                            v-for="(column, columnIndex) in columns"
                            :key="column.key"
                        >
                            <div
                                class="flex items-center gap-3 select-none"
                                :class="
                                    columnClasses({ column, target: 'header' })
                                "
                            >
                                <DataTableCheckboxBulkActionsMarkAll
                                    v-if="records && columnIndex === 0"
                                    v-model:records="recordsModel"
                                    :data="data"
                                />
                                <component
                                    v-if="column.headerComponent"
                                    :is="column.headerComponent"
                                    :column="{ ...column, index: columnIndex }"
                                />
                                <slot
                                    v-if="column.headerSlot"
                                    :name="column.headerSlot"
                                    :column="{ ...column, index: columnIndex }"
                                />
                                <span
                                    v-else
                                    class="font-medium text-gray-900"
                                    v-html="column.title || ''"
                                >
                                </span>
                            </div>
                        </th>
                    </tr>
                </thead>
                <tbody>
                    <tr
                        class="border-t border-gray-200 transition-all duration-180 hover:bg-gray-50"
                        v-for="row in data"
                        :key="row.id"
                    >
                        <td
                            v-for="(column, columnIndex) in columns"
                            :key="column.key"
                            class="border-gray-200"
                        >
                            <div
                                class="flex gap-3 items-center"
                                :class="
                                    columnClasses({ column, target: 'cell' })
                                "
                            >
                                <DataTableCheckboxBulkActions
                                    v-if="records && columnIndex === 0"
                                    v-model:records="recordsModel"
                                    :row="row"
                                />
                                <component
                                    v-if="column.component"
                                    :is="column.component"
                                    :row="row"
                                    :column="{ ...column, index: columnIndex }"
                                />
                                <slot
                                    v-else-if="column.cellSlot"
                                    :name="column.cellSlot"
                                    :row="row"
                                    :column="{ ...column, index: columnIndex }"
                                />
                                <span
                                    v-else
                                    class="text-gray-800"
                                    v-html="
                                        column.formatter
                                            ? column.formatter(row, column)
                                            : row[column.key]
                                    "
                                >
                                </span>
                            </div>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
        <div v-if="records" class="flex px-3 py-2 border-t border-gray-200">
            <Button size="md">actions</Button>
        </div>
    </div>

    <pre>{{ recordsModel }}</pre>
</template>
<script lang="ts" setup>
import { TableColumn, TableProps } from "./DataTable.types";
import DataTableCheckboxBulkActions from "./DataTableSubcomponents/DataTableCheckboxBulkActions.vue";
import DataTableCheckboxBulkActionsMarkAll from "./DataTableSubcomponents/DataTableCheckboxBulkActionsMarkAll.vue";
import Button from "../Button/Button.vue";

withDefaults(defineProps<TableProps>(), {
    loading: false,
    columns: () => [] as TableColumn[],
    data: () => [] as any[],
    records: null,
});

const columnClasses = ({
    column,
    target,
}: {
    column: TableColumn;
    target: "header" | "cell";
}): Record<string, boolean> => {
    return {
        [column.classes || "px-3 py-2"]: true,
        [`${target}-${column.key}`]: true,
        "justify-start": column.align === "left" || !column.align,
        "justify-center": column.align === "center",
        "justify-end": column.align === "right",
    };
};

const recordsModel = defineModel<string[] | null>("records", {
    default: null,
});
</script>
