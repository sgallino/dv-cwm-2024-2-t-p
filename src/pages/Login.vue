<!-- <script>
import BaseHeading1 from '../components/BaseHeading1.vue';
import { login } from '../services/auth';

export default {
    name: 'Login',
    components: { BaseHeading1 },
    data() {
        return {
            user: {
                email: '',
                password: '',
            },
            loading: false,
        };
    },
    methods: {
        async handleSubmit() {
            this.loading = true;

            try {
                await login({
                    email: this.user.email, 
                    password: this.user.password,
                    // ...this.user,
                });
                console.log("Usuario autenticado con éxito :D");

                // Redireccionamos al perfil.
                this.$router.push('/mi-perfil');
            } catch (error) {
                // TODO: Manejar el error :D
                console.error("[Login.vue] Error al autenticar: ", error);
                throw error;
            }
            this.loading = false;
        }
    }
}
</script> -->
<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { login } from '../services/auth';
import BaseHeading1 from '../components/BaseHeading1.vue';
import BaseButton from '../components/BaseButton.vue';
import BaseLabel from '../components/BaseLabel.vue';
import BaseInput from '../components/BaseInput.vue';

// Una cosa que tampoco tenemos en la Composition API son las propiedades especiales
// como $route o $router.
// En su lugar, tenemos que pedir esos valores a través de funciones como useRoute()
// o useRouter().
const router = useRouter();

// Invocamos el "composable" del form de login.
const { loading, user, feedback, handleSubmit } = useLoginForm(router);

/**
 * 
 * @param {import('vue-router').Router} router 
 */
function useLoginForm(router) {
    // Para definir valores del "state" del componente (lo que guardábamos en data()),
    // usamos la función ref().
    // ref() (abreviación de referencia reactiva) permite crear valores que cuando
    // cambien, se actualice el componente.
    // Funciona a través de la clase Proxy de JS. Por extensión, los valores reactivos
    // son objetos que tienen una propiedad "value" donde figura el valor real.
    // Esto va a ser importante a la hora de querer usar en el <script> las variables
    // reactivas.
    const loading = ref(false);
    const user = ref({
        email: '',
        password: '',
    });
    const feedback = ref(null);

    // Las funciones que definíamos en "methods" para que estuvieran disponibles
    // en el template, en la Composition API son funciones comunes.
    async function handleSubmit() {
        // Para acceder a los valores de las variables reactivas, no tenemos
        // el "this" que existe en la Options API. En su lugar, accedemos a la
        // propiedad "value" de la variable reactiva.
        loading.value = true;
        feedback.value = null;

        try {
            await login({
                email: user.value.email, 
                password: user.value.password,
                // ...user.value,
            });
            console.log("Usuario autenticado con éxito :D");

            // Redireccionamos al perfil.
            router.push('/mi-perfil');
        } catch (error) {
            // TODO: Manejar el error :D
            console.error("[Login.vue] Error al autenticar: ", error);
            feedback.value = error;
        }
        loading.value = false;
    }

    return {
        user,
        loading,
        feedback,
        handleSubmit,
    }
}
</script>

<template>
    <BaseHeading1>Ingresar con tu Cuenta</BaseHeading1>

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
        <BaseButton :loading="loading">Ingresar</BaseButton>
    </form>
</template>