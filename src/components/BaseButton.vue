<script setup>
import BaseLoader from './BaseLoader.vue';

// Para definir las propiedades del componente en la Composition API,
// usamos la "macro" defineProps().
// Si queremos usar las propiedades solo en el template, alcanza con
// solo el defineProps.
// Si queremos poder usar las propiedades también en el <script>,
// entonces debemos capturar el retorno del defineProps().
// const props = defineProps({
defineProps({
    loading: {
        type: Boolean,
        default: false,
    }
});
</script>

<template>
    <button 
        type="submit"
        class="transition-all py-2 px-4 rounded bg-blue-700 text-white focus:bg-blue-500 hover:bg-blue-500 active:bg-blue-900"
    >
        <slot v-if="!loading">Enviar</slot>
        <BaseLoader v-else />
    </button>
</template>