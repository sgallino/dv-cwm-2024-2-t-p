<script setup>
// Forma tradicional.
// defineProps(['modelValue']);
// defineEmits(['update:modelValue']);
// Vue 3.4+
const model = defineModel();
</script>

<template>
    <!-- Forma tradicional -->
    <!-- <input
        type="text"
        class="w-full p-2 border rounded read-only:bg-gray-200"
        :value="modelValue"
        @input="$emit('update:modelValue', $event.target.value)"
    > -->
    <!-- Vue 3.4+ -->
    <input
        type="text"
        class="w-full p-2 border rounded read-only:bg-gray-200"
        v-model="model"
    >
</template>