<template>
    <input
        v-model="recordsModel"
        :value="row.id"
        :id="`row.id-${row.id}`"
        type="checkbox"
        class="w-5 h-5 appearance-none border cursor-pointer border-indigo-300 rounded-sm hover:border-indigo-500 hover:bg-indigo-400 checked:bg-indigo-500 checked:border-indigo-500 relative checked:after:content-['✔'] checked:after:absolute checked:after:top-0 checked:after:left-0 checked:after:w-full checked:after:h-full checked:after:flex checked:after:items-center checked:after:justify-center checked:after:text-white checked:after:text-sm disabled:cursor-not-allowed disabled:bg-gray-200 disabled:border-gray-300 disabled:checked:bg-gray-400 disabled:checked:border-gray-400 disabled:checked:after:text-gray-200"
    />
</template>
<script lang="ts" setup>
withDefaults(defineProps<{ ids: (string | number)[] | null; row: any }>(), {
    ids: null,
    row: () => ({}),
});

const recordsModel = defineModel<(string | number)[] | null>("ids");
</script>
