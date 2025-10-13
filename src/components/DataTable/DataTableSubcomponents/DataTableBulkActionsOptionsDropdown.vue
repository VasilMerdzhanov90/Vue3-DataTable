<template>
    <transition name="fade">
        <div
            v-if="openModel"
            class="bg-white py-1 px-2 border border-gray-200 rounded-md shadow-md absolute left-3 z-3 max-w-50"
            :class="{
                'top-full': openDirection === 'down',
                'bottom-full': openDirection === 'up',
            }"
        >
            <ul class="m-0 p-0 list-none">
                <li
                    v-for="(value, index) in options"
                    :key="value.label"
                    @click="() => handleAction(value, index)"
                    class="relative hover:bg-gray-100 rounded-md cursor-pointer px-2 py-1"
                >
                    <div
                        v-if="loaders[index]"
                        class="absolute inset-0 bg-gray-100 opacity-50 flex items-center justify-center rounded-md"
                    >
                        <i class="pi pi-spin pi-spinner"></i>
                    </div>
                    {{ value.label }}
                </li>
            </ul>
            asd
        </div>
    </transition>
</template>
<script lang="ts" setup>
import { ref } from "vue";
import type { BulkActionOption } from "./../DataTable.types";
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
<style scoped>
.fade-enter-active,
.fade-leave-active {
    transition: all 0.35s;
}
.fade-enter,
.fade-leave-to {
    opacity: 0;
    max-height: 0;
    overflow: hidden;
}
.fade-enter-to,
.fade-leave {
    opacity: 1;
    max-height: none;
}
</style>
