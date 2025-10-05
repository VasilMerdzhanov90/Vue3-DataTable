<template>
    <DataTable
        v-model:columns="columns"
        :loading="loading"
        v-model:data="data"
        v-model:records="records"
    >
        <template #recordName="{ row, column }">
            <span style="color: red">Custom: {{ row[column.key] }}</span>
        </template>
    </DataTable>
    <pre>{{columns}}</pre>
</template>
<script setup lang="ts">
import { ref } from "vue";
import DataTable from "./components/DataTable/DataTable.vue";

const records = ref<any[]>([]);

const columns = ref([
    {
        title: "ID",
        key: "id",
        sortable: true,
    },
    {
        title: "Record ID",
        key: "record_type",
    },
    {
        title: "Record Name",
        key: "name",
        cellSlot: "recordName",
    },
]);

const loading = false;

const data = ref([
    {
        record_id: 15,
        record_type: "xml_sync_task",
        site_id: 16372,
        name: "XML синхронизация - Ivo 2",
        mapping: "xml_sync",
        create: 0,
        update: 45271,
        nothing: 80,
        error: 0,
        total: 45351,
        updated_at: "2025-09-11T10:09:24+03:00",
        created_at: "2025-09-11T10:09:15+03:00",
        id: "68c2759bd9f36b6c7806162a",
    },
    {
        record_id: 15,
        record_type: "xml_sync_task",
        site_id: 16372,
        name: "XML синхронизация - Ivo 2",
        mapping: "xml_sync",
        create: 0,
        update: 45271,
        nothing: 80,
        error: 0,
        total: 45351,
        updated_at: "2025-09-10T21:25:14+03:00",
        created_at: "2025-09-10T21:25:06+03:00",
        id: "68c1c2820147d6a86f06934f",
    },
    {
        record_id: 15,
        record_type: "xml_sync_task",
        site_id: 16372,
        name: "XML синхронизация - Ivo 2",
        mapping: "xml_sync",
        create: 0,
        update: 45271,
        nothing: 80,
        error: 0,
        total: 45351,
        updated_at: "2025-09-09T21:46:44+03:00",
        created_at: "2025-09-09T21:46:35+03:00",
        id: "68c0760b435a8d2cbe0cf266",
    },
]);
</script>
