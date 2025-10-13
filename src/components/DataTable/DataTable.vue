<template>
    <div class="data-table__wrapper">
        <div
            v-if="recordsModel"
            class="data-table__actions data-table__actions--top"
        >
            <slot name="bulkActions">
                <Button
                    @click="bulkActionsOpenTop = !bulkActionsOpenTop"
                    size="md"
                >
                    actions
                </Button>
            </slot>
            <DataTableBulkActionsOptionsDropdown
                v-model:open="bulkActionsOpenTop"
                v-model:ids="recordsModel"
                :options="bulkActions"
                open-direction="down"
            />
        </div>
        <div class="data-table__wrapper--overflow">
            <table>
                <thead class="data-table__header">
                    <tr>
                        <th
                            v-for="(column, columnIndex) in columnsModel"
                            :key="column.key"
                        >
                            <div
                                class="data-table__header--inner"
                                :class="
                                    columnClasses({ column, target: 'header' })
                                "
                            >
                                <DataTableCheckboxBulkActionsMarkAll
                                    v-if="ids && columnIndex === 0"
                                    v-model:ids="recordsModel"
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
                <tbody class="data-table__body">
                    <tr v-for="(row, rowIndex) in displayedData" :key="row.id">
                        <td
                            v-for="(column, columnIndex) in columnsModel"
                            :key="column.key"
                        >
                            <div
                                class="data-table__body--inner"
                                :class="
                                    columnClasses({ column, target: 'cell' })
                                "
                            >
                                <DataTableCheckboxBulkActions
                                    v-if="ids && columnIndex === 0"
                                    v-model:ids="recordsModel"
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
        <div
            v-if="recordsModel"
            class="data-table__actions data-table__actions--bottom"
        >
            <slot name="bulkActions">
                <Button
                    @click="bulkActionsOpenBottom = !bulkActionsOpenBottom"
                    size="md"
                >
                    actions
                </Button>
            </slot>
            <DataTableBulkActionsOptionsDropdown
                v-model:open="bulkActionsOpenBottom"
                v-model:ids="recordsModel"
                :options="bulkActions"
                open-direction="up"
            />
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
import { computed, watch, ref } from "vue";
import type { TableColumn, TableProps } from "./DataTable.types";
import DataTableCheckboxBulkActions from "./DataTableSubcomponents/DataTableCheckboxBulkActions.vue";
import DataTableCheckboxBulkActionsMarkAll from "./DataTableSubcomponents/DataTableCheckboxBulkActionsMarkAll.vue";
import Button from "../Button/Button.vue";
import DataTableColumnSortable from "./DataTableSubcomponents/DataTableColumnSortable.vue";
import DataTableRowDataCell from "./DataTableSubcomponents/DataTableRowDataCell.vue";
import DataTablePaginator from "./DataTableSubcomponents/DataTablePaginator.vue";
import DataTableBulkActionsOptionsDropdown from "./DataTableSubcomponents/DataTableBulkActionsOptionsDropdown/DataTableBulkActionsOptionsDropdown.vue";

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
    ids: null,
    page: 1,
    perPage: 10,
    perPageOptions: () => [5, 10, 20, 50],
    total: 0,
    bulkActions: () => [],
});

const columnClasses = ({
    column,
    target,
}: {
    column: TableColumn;
    target: "header" | "cell";
}): Record<string, boolean> => {
    return {
        [`${target}-${column.key}`]: true,
        "justify-start": column.align === "left" || !column.align,
        "justify-center": column.align === "center",
        "justify-end": column.align === "right",
    };
};

const bulkActionsOpenTop = ref<boolean>(false);
const bulkActionsOpenBottom = ref<boolean>(false);
const pageModel = defineModel<number>("page", {
    default: 1,
});
const perPageModel = defineModel<number>("perPage", {
    default: 10,
});
const recordsModel = defineModel<(string | number)[] | null>("ids", {
    default: null,
});
const columnsModel = defineModel<TableColumn[]>("columns", {
    default: () => [] as TableColumn[],
});
const dataModel = defineModel<any[]>("data", {
    default: () => [] as any[],
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
                page: pageModel.value as number,
                perPage: perPageModel.value as number,
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
<style>
@import "./DataTable.styles.css";
</style>
