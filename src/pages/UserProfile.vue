<!-- <script>
import BaseHeading1 from '../components/BaseHeading1.vue';
import BaseLoader from '../components/BaseLoader.vue';
import ProfileData from '../components/profile/ProfileData.vue';
import { getUserProfileById } from '../services/user-profile';

export default {
    name: 'UserProfile',
    components: { BaseHeading1, ProfileData, BaseLoader },
    data() {
        return {
            loading: false,
            user: {
                id: null,
                email: null,
                displayName: null,
                photoURL: null,
                bio: null,
                career: null,
            },
        }
    },
    async mounted() {
        this.loading = true;
        // this.$route contiene la instancia del objeto de la ruta que se está renderizando.
        // De acá podemos sacar todo tipo de info que nos sea útil, como por ejemplo, los valores de los parámetros de la
        // ruta, a través de la propiedad "params".
        this.user = await getUserProfileById(this.$route.params.id);
        
        this.loading = false;
    }
}
</script> -->
<script setup>
import BaseHeading1 from '../components/BaseHeading1.vue';
import BaseLoader from '../components/BaseLoader.vue';
import ProfileData from '../components/profile/ProfileData.vue';
import { useRoute } from 'vue-router';
import useUserProfile from '../composables/useUserProfile';

const route = useRoute();

const { user, loading } = useUserProfile(route.params.id);
</script>

<template>
    <BaseLoader v-if="loading" />
    <template v-else>
        <BaseHeading1>Perfil de {{ user.email }}</BaseHeading1>

        <ProfileData :user="user" />

        <hr class="mb-4">

        <router-link
            :to="`/usuario/${user.id}/chat`"
            class="text-blue-700 underline"
        >Conversación Privada con {{ user.email }}</router-link>
    </template> 
</template>