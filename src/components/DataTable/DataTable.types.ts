import type { Component } from "vue";

export interface TableColumn {
    title: string;
    key: string;
    sortable?: boolean;
    align?: "left" | "center" | "right";
    classes?: string;
    slot?: string;
    formatter?: (row: any, column?: TableColumn) => string;
    component?: Component;
    headerComponent?: Component;
    headerSlot?: string;
    cellSlot?: string;
    index?: number;
    direction?: string | null;
}

export interface TableProps {
    loading?: boolean;
    columns: TableColumn[];
    data?: any[];
    records?: string[] | null;
    page?: number;
    perPage?: number;
    total?: number;
    perPageOptions?: number[];
}
