<script setup>
import { ref } from 'vue';
import { register } from '../services/auth';
import { useRouter } from 'vue-router';
import BaseHeading1 from '../components/BaseHeading1.vue';
import BaseButton from '../components/BaseButton.vue';
import BaseLabel from '../components/BaseLabel.vue';
import BaseInput from '../components/BaseInput.vue';

const router = useRouter();

const loading = ref(false);
const user = ref({
    email: '',
    password: '',
});

const feedback = ref(null);

async function handleSubmit() {
    loading.value = true;
    feedback.value = null;

    try {
        await register({...user.value});

        router.push('/mi-perfil');
    } catch (error) {
        // TODO: Manejar el error...
        feedback.value = error;
    }

    loading.value = false;
}
</script>

<template>
    <BaseHeading1>Crear una Cuenta</BaseHeading1>

    <div 
        v-if="feedback != null"
        class="p-4 mb-4 rounded bg-red-200"
    >{{ feedback }}</div>

    <form 
        action="#"
        @submit.prevent="handleSubmit"
    >
        <div class="mb-4">
            <BaseLabel for="email">Email</BaseLabel>
            <BaseInput
                type="email"
                id="email"
                :readonly="loading"
                v-model="user.email"
            />
        </div>
        <div class="mb-4">
            <BaseLabel for="password">Contraseña</BaseLabel>
            <BaseInput
                type="password"
                id="password"
                :readonly="loading"
                v-model="user.password"
            />
        </div>
        <BaseButton :loading="loading">Crear Cuenta</BaseButton>
    </form>
</template>