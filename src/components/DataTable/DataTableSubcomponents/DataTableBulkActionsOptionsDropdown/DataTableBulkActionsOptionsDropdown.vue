<template>
    <transition name="fade">
        <div
            v-if="openModel"
            class="data-table__bulk-actions"
            :class="{
                'top-full': openDirection === 'down',
                'bottom-full': openDirection === 'up',
            }"
        >
            <ul>
                <li
                    v-for="(value, index) in options"
                    :key="value.label"
                    @click="() => handleAction(value, index)"
                >
                    <div v-if="loaders[index]" class="loader">
                        <span></span>
                    </div>
                    {{ value.label }}
                </li>
            </ul>
        </div>
    </transition>
</template>
<script lang="ts" setup>
import { ref } from "vue";
import type { BulkActionOption } from "../../DataTable.types";
const props = withDefaults(
    defineProps<{
        open: boolean;
        ids: (string | number)[] | null;
        options: BulkActionOption[];
        openDirection?: "up" | "down";
    }>(),
    {
        options: () => [] as BulkActionOption[],
        openDirection: "down",
    }
);

const openModel = defineModel<boolean>("open", {
    default: false,
});

const loaders = ref<Record<number, boolean>>({});

const handleAction = async (
    action: BulkActionOption,
    index: number
): Promise<void> => {
    if (!action.action) return;
    loaders.value[index] = true;
    try {
        const response = await action.action(props.ids || []);
        if (action.onSuccess) {
            await action.onSuccess(response);
        }
        openModel.value = false;
    } catch (error) {
        if (action.onError) {
            await action.onError(error);
        } else {
            console.log(error);
        }
    } finally {
        loaders.value[index] = false;
    }
};
</script>
<style>
@import "./DataTableBulkActionsOptionsDropdown.style.css";
</style>
