<template>
    <table class="mt-2 w-full">
        <thead class="border-y border-gray-200">
            <tr>
                <th v-for="column in columns" :key="column.key">
                    <div
                        class="flex select-none"
                        :class="columnClasses({ column, target: 'header' })"
                    >
                        <span
                            class="font-medium text-gray-900"
                            v-html="column.title"
                        >
                        </span>
                    </div>
                </th>
            </tr>
        </thead>
        <tbody>
            <tr class="transition-all duration-180 hover:bg-gray-50" v-for="row in data" :key="row.id">
                <td v-for="column in columns" :key="column.key">
                    <div
                        class="flex"
                        :class="columnClasses({ column, target: 'cell' })"
                    >
                        <span
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
</template>
<script lang="ts" setup>
import type { Component } from "vue";

interface TableColumn {
    title: string;
    key: string;
    sortable?: boolean;
    align?: "left" | "center" | "right";
    classes?: string;
    slot?: string;
    formatter?: (row: any, column?: TableColumn) => string;
    component?: Component;
}

interface TableProps {
    loading?: boolean;
    columns: TableColumn[];
    data?: any[];
}

withDefaults(defineProps<TableProps>(), {
    loading: false,
    columns: () => [] as TableColumn[],
    data: () => [] as any[],
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
</script>
