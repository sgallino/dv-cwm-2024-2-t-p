<script>
import BaseHeading1 from '../components/BaseHeading1.vue';
import { editMyProfile, subscribeToAuthState } from '../services/auth';

let unsubscribeAuth = () => {};

export default {
    name: 'MyProfileEdit',
    components: { BaseHeading1 },
    data() {
        return {
            editData: {
                displayName: '',
                bio: '',
                career: '',
            },
            editing: false,
        };
    },
    methods: {
        async handleSubmit() {
            this.editing = true;

            try {
                await editMyProfile({...this.editData});
            } catch (error) {
                // TODO: Manejar el error...
            }

            this.editing = false;
        }
    },
    mounted() {
        // Pedimos los datos del usuario autenticado para asignarlos en los campos del form.
        unsubscribeAuth = subscribeToAuthState(userData => this.editData = { 
            displayName: userData.displayName || '',
            bio: userData.bio || '',
            career: userData.career || '',
        });
    },
    unmounted() {
        unsubscribeAuth();
    }
}
</script>

<template>
    <BaseHeading1>Editar mi Perfil</BaseHeading1>

    <form 
        action="#"
        @submit.prevent="handleSubmit"
    >
        <div class="mb-4">
            <label 
                for="bio"
                class="block mb-2"
            >Biografía</label>
            <textarea
                id="bio"
                class="w-full min-h-8 p-2 border rounded"
                v-model="editData.bio"
            ></textarea>
        </div>
        <div class="mb-4">
            <label 
                for="displayName"
                class="block mb-2"
            >Nombre de Usuario</label>
            <input
                type="text"
                id="displayName"
                class="w-full p-2 border rounded"
                v-model="editData.displayName"
            >
        </div>
        <div class="mb-4">
            <label 
                for="career"
                class="block mb-2"
            >Carrera</label>
            <input
                type="text"
                id="career"
                class="w-full p-2 border rounded"
                v-model="editData.career"
            >
        </div>
        <button 
            type="submit"
            class="transition-all py-2 px-4 rounded bg-blue-700 text-white focus:bg-blue-500 hover:bg-blue-500 active:bg-blue-900"
        >Actualizar mi Perfil</button>
    </form>
</template>