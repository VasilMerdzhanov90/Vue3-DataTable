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
                            v-for="(column, columnIndex) in columnsModel"
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
                                <DataTableColumnSortable
                                    v-model:column="columnsModel[columnIndex]"
                                    :index="columnIndex"
                                    @sort="sort"
                                >
                                    <template #body v-if="column.headerSlot">
                                        <slot
                                            :name="column.headerSlot"
                                            :column="{
                                                ...column,
                                                index: columnIndex,
                                            }"
                                        />
                                    </template>
                                </DataTableColumnSortable>
                            </div>
                        </th>
                    </tr>
                </thead>
                <tbody>
                    <tr
                        class="border-t border-gray-200 transition-all duration-180 hover:bg-gray-50"
                        v-for="(row, rowIndex) in displayedData"
                        :key="row.id"
                    >
                        <td
                            v-for="(column, columnIndex) in columnsModel"
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
                                <DataTableRowDataCell
                                    :row="displayedData[rowIndex]"
                                    :rowIndex="rowIndex"
                                    :column="column"
                                    :columnIndex="columnIndex"
                                >
                                    <template #body v-if="column.cellSlot">
                                        <slot
                                            :row="row"
                                            :name="column.cellSlot"
                                            :column="{
                                                ...column,
                                                index: columnIndex,
                                            }"
                                        />
                                    </template>
                                </DataTableRowDataCell>
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
    <DataTablePaginator
        v-model="pageModel"
        v-model:per-page="perPageModel"
        :total-items="total"
        :page-sizes="perPageOptions"
        @paginate="paginate"
    />
</template>
<script lang="ts" setup>
import { computed, watch } from "vue";
import type { TableColumn, TableProps } from "./DataTable.types";
import DataTableCheckboxBulkActions from "./DataTableSubcomponents/DataTableCheckboxBulkActions.vue";
import DataTableCheckboxBulkActionsMarkAll from "./DataTableSubcomponents/DataTableCheckboxBulkActionsMarkAll.vue";
import Button from "../Button/Button.vue";
import DataTableColumnSortable from "./DataTableSubcomponents/DataTableColumnSortable.vue";
import DataTableRowDataCell from "./DataTableSubcomponents/DataTableRowDataCell.vue";
import DataTablePaginator from "./DataTableSubcomponents/DataTablePaginator.vue";

const emit = defineEmits<{
    (
        e: "sort",
        column: TableColumn,
        context: { key: string; direction: "asc" | "desc" | null }
    ): void;
    (e: "paginate", value: { page: number; perPage: number }): void;
    (
        e: "change",
        value: {
            pagination: {
                page: number;
                perPage: number;
            };
            sort: {
                key: string | null;
                direction: "asc" | "desc" | null;
            } | null;
        }
    ): void;
}>();

withDefaults(defineProps<TableProps>(), {
    loading: false,
    columns: () => [] as TableColumn[],
    data: () => [] as any[],
    records: null,
    page: 1,
    perPage: 10,
    perPageOptions: () => [5, 10, 20, 50],
    total: 0,
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

const pageModel = defineModel<number>("page", {
    default: 1,
});
const perPageModel = defineModel<number>("perPage", {
    default: 10,
});

const recordsModel = defineModel<string[] | null>("records", {
    default: null,
});

const columnsModel = defineModel<TableColumn[]>("columns", {
    default: () => [],
});

const dataModel = defineModel<any[]>("data", {
    default: () => [],
});

const displayedData = computed({
    get: () => {
        let isSorted = columnsModel.value.some(
            (col) => col.sortable && col.direction
        );
        if (!isSorted) return dataModel.value;
        let sortedColumn = columnsModel.value.find(
            (col) => col.sortable && col.direction
        );
        if (!sortedColumn) return dataModel.value;
        let key = sortedColumn.key;
        let direction = sortedColumn.direction;

        return [...dataModel.value].sort((a, b) => {
            const isNumber = !isNaN(a[key]) && !isNaN(b[key]);
            if (!isNumber) {
                if (direction === "asc") {
                    return (a[key] ?? "")
                        .toString()
                        .localeCompare((b[key] ?? "").toString());
                } else {
                    return (b[key] ?? "")
                        .toString()
                        .localeCompare((a[key] ?? "").toString());
                }
            } else {
                if (direction === "asc") {
                    return (a[key] ?? 0) - (b[key] ?? 0);
                } else {
                    return (b[key] ?? 0) - (a[key] ?? 0);
                }
            }
        });
    },
    set: (value) => {
        dataModel.value = value;
    },
});

const sort = (
    column: TableColumn,
    context: { key: string; direction: "asc" | "desc" | null }
) => {
    emit("sort", column, context);

    columnsModel.value = columnsModel.value.map((col) => {
        if (col.key === column.key) return column;
        return { ...col, direction: null };
    });
};

const paginate = (value: { page: number; perPage: number }): void => {
    emit("paginate", value);
};

const sortedColumn = computed(() => {
    return (
        columnsModel.value.find((col) => col.sortable && col.direction) || null
    );
});

watch(
    () => [pageModel, perPageModel, columnsModel],
    () => {
        emit("change", {
            pagination: {
                page: pageModel.value,
                perPage: perPageModel.value,
            },
            sort: sortedColumn.value
                ? {
                      key: sortedColumn.value.key ?? null,
                      direction:
                          sortedColumn.value.direction === "asc" ||
                          sortedColumn.value.direction === "desc"
                              ? sortedColumn.value.direction
                              : null,
                  }
                : null,
        });
    },
    { deep: true }
);
</script>
