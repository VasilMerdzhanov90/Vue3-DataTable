<template>
    <div
        :class="[spinnerBorder, spinnerSize, classes]"
        class="rounded-full border-2 border-b-transparent animate-spin"
    ></div>
</template>
<script lang="ts" setup>
import { computed } from "vue";
import { SpinnerProps } from "./Spinner.types";

const props = withDefaults(defineProps<SpinnerProps>(), {
    variant: "primary" as "primary" | "secondary",
    size: "small" as "small" | "medium" | "large",
    classes: "" as string,
});
const spinnerBorder = computed(
    () => `border-[${props.variant === "primary" ? "#615fff" : "#FFF"}]`
);
const spinnerSize = computed(() => {
    switch (props.size) {
        case "small":
            return "w-[14px] h-[14px]";
        case "medium":
            return "w-[18px] h-[18px]";
        case "large":
            return "w-[22px] h-[22px]";
        default:
            return "w-[14px] h-[14px]";
    }
});
</script>
