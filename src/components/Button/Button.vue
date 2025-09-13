<template>
    <button
        :class="[
            'cc-btn inline-flex items-center justify-center gap-1 font-medium transition duration-200 disabled:pointer-events-none!',
            sizeClasses,
            variantClasses,
            { 'opacity-50 pointer-events-none': disabled || loading },
            additionalClasses,
        ]"
        :disabled="disabled || loading"
    >
        <Spinner
            v-if="loading"
            :variant="variant === 'primary' ? 'secondary' : 'primary'"
        />
        <span
            v-if="slots['icon-left'] && !loading"
            :class="iconClasses"
            class="flex items-center"
        >
            <slot name="icon-left" />
        </span>

        <span class="capitalize inline-flex items-center text-nowrap">
            <slot />
        </span>

        <span
            v-if="slots['icon-right']"
            :class="iconClasses"
            class="flex items-center"
        >
            <slot name="icon-right" />
        </span>
    </button>
</template>

<script lang="ts" setup>
import { computed } from "vue";
import Spinner from "../Spinner/Spinner.vue";
import { ButtonProps, Variant, Size } from "./Button.types";

const slots = defineSlots();

const props = withDefaults(defineProps<ButtonProps>(), {
    variant: "primary" as Variant,
    size: "default" as Size,
    additionalClasses: "" as string,
});

const variant = computed(() => props.variant ?? "primary");
const size = computed(() => props.size ?? "md");

const variantClasses = computed(() => {
    switch (variant.value) {
        case "primary":
            return "bg-[#615fff] text-white border border-[#615fff] hover:bg-[#B38AF4] hover:border-[#B38AF4] active:bg-[#615fff] active:border-[#615fff] focus:outline-none focus:shadow-[0_0_0_1px_#615fff]";
        case "secondary":
            return "bg-[#FFF] text-[#615fff] border border-[#615fff] hover:bg-[#EDEEFA] hover:border-[#B38AF4] active:bg-[#EFE5FF] active:border-[#615fff] focus:outline-none focus:bg-[#EFE5FF] focus:shadow-[0_0_0_1px_#615fff]";
        case "default":
            return "bg-[#352164] text-white border border-[#352164] hover:bg-[#62499C] hover:border-[#62499C] active:bg-[#513382] active:border-[#513382] focus:outline-none focus:shadow-[0_0_0_1px_#615fff]";
        case "ghost":
            return "bg-[#FFF] text-[#3D414D] border border-[#D6D9E9] hover:bg-[#F0F0F0] hover:border-[#D6D9E9] active:bg-[#E1E1ED] active:border-[#D6D9E9] focus:outline-none focus:bg-[#FFF] focus:shadow-[0_0_0_1px_#615fff]";
        case "danger":
            return "bg-[#fc4f4e] text-white border border-[#fc4f4e] hover:bg-[#ee3137] hover:border-[#ee3137] active:bg-[#ee3137] active:border-[#ee3137] focus:outline-none focus:shadow-[0_0_0_1px_#ee3137]";
        default:
            return "bg-[#615fff] text-white border border-[#615fff] hover:bg-[#B38AF4] hover:border-[#B38AF4] active:bg-[#615fff] active:border-[#615fff] focus:outline-none focus:shadow-[0_0_0_1px_#615fff]";
    }
});

const sizeClasses = computed(() => {
    switch (size.value) {
        case "sm":
            return "text-xs! leading-[24px] px-2.5 py-0.5 gap-1 rounded-md";
        case "md":
            return "text-sm! px-2.5 py-0.5 gap-1 rounded-md";
        case "default":
            return "text-base font-medium px-3 py-1 gap-1 rounded-md";
        case "lg":
            return "text-lg font-medium px-4 py-2 gap-2 rounded-md";
        default:
            return "text-base font-medium px-3 py-1 gap-1 rounded-md";
    }
});

const iconClasses = computed(() => {
    switch (variant.value) {
        case "ghost":
        case "secondary":
            return "text-[#615fff]";
        case "primary":
        case "default":
            return "text-[#FFF]";
        default:
            return "text-[#615fff]";
    }
});
</script>
